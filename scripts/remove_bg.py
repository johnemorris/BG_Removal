import sys
import os
import argparse
import cv2
import numpy as np
from PIL import Image
from rembg import remove, new_session

session = None
current_model_name = None

def get_session(model_name='isnet-general-use'):
    global session, current_model_name
    if session is None or current_model_name != model_name:
        providers = ['CPUExecutionProvider']
        try:
            session = new_session(model_name, providers=providers)
            current_model_name = model_name
        except Exception as e:
            print(f"Warning: Failed to load {model_name} ({e}), falling back to u2net", file=sys.stderr)
            session = new_session('u2net', providers=providers)
            current_model_name = 'u2net'
    return session

def refine_edges(
    rgba_img: Image.Image,
    defringe_amount: int = 2,
    edge_shift: int = 0,
    edge_feather: float = 0.5
) -> Image.Image:
    """
    Photoshop / Pixlr-grade edge refinement & hair defringing.
    - edge_shift: Negative chokes the mask inward by 1-2px, eliminating background halos.
    - defringe_amount: Extends natural foreground hair color into semi-transparent edge pixels.
    - edge_feather: Subtle Gaussian edge smoothing.
    """
    img_np = np.array(rgba_img)
    if img_np.shape[2] != 4:
        return rgba_img

    rgb = img_np[:, :, :3].copy()
    alpha = img_np[:, :, 3].copy()

    # 1. Edge Shift / Choke (shaves off residual background halo)
    if edge_shift != 0:
        kernel_size = abs(edge_shift) * 2 + 1
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
        if edge_shift < 0:
            alpha = cv2.erode(alpha, kernel, iterations=1)
        else:
            alpha = cv2.dilate(alpha, kernel, iterations=1)

    # 2. Edge Feathering / Smoothing
    if edge_feather > 0:
        k_size = int(edge_feather * 4) | 1
        if k_size >= 3:
            alpha = cv2.GaussianBlur(alpha, (k_size, k_size), edge_feather)

    # 3. Color Decontamination / Defringing
    # Inpaints color only into thin background halos (low alpha threshold < 50),
    # preserving internal fur textures, ears, and subject details without smearing.
    if defringe_amount > 0:
        fringe_mask = ((alpha > 0) & (alpha < 50)).astype(np.uint8) * 255
        if np.sum(fringe_mask) > 0:
            rgb = cv2.inpaint(rgb, fringe_mask, inpaintRadius=min(2, defringe_amount), flags=cv2.INPAINT_TELEA)

    result_np = np.dstack((rgb, alpha))
    return Image.fromarray(result_np)

def process_image(
    input_path: str,
    output_path: str,
    defringe: int = 2,
    shift: int = 0,
    feather: float = 0.5,
    alpha_matting: bool = False,
    model: str = 'isnet-general-use'
):
    sess = get_session(model)
    with open(input_path, 'rb') as f:
        inp = f.read()

    # 1. AI segmentation
    if alpha_matting:
        output_bytes = remove(
            inp,
            session=sess,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=10,
            post_process_mask=False
        )
    else:
        output_bytes = remove(inp, session=sess, post_process_mask=False)

    # 2. Load into PIL
    import io
    raw_cutout = Image.open(io.BytesIO(output_bytes)).convert("RGBA")

    # 3. Apply hair defringe and edge choke
    refined = refine_edges(
        raw_cutout,
        defringe_amount=defringe,
        edge_shift=shift,
        edge_feather=feather
    )

    refined.save(output_path, format="PNG")
    print(f"SUCCESS: {output_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('input', help='Input image path')
    parser.add_argument('output', help='Output image path')
    parser.add_argument('--model', default='isnet-general-use', help='Rembg segmentation model (isnet-general-use, u2net, etc.)')
    parser.add_argument('--defringe', type=int, default=2, help='Defringe color radius (0 to 5)')
    parser.add_argument('--shift', type=int, default=0, help='Edge shift / choke in pixels (-5 to 5)')
    parser.add_argument('--feather', type=float, default=0.5, help='Edge feather radius (0 to 5)')
    parser.add_argument('--alpha-matting', action='store_true', help='Enable PyMatting alpha matting')

    args = parser.parse_args()
    process_image(
        args.input,
        args.output,
        defringe=args.defringe,
        shift=args.shift,
        feather=args.feather,
        alpha_matting=args.alpha_matting,
        model=args.model
    )
