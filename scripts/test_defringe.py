import cv2
import numpy as np
from PIL import Image
import rembg

def defringe_image(rgba_img: Image.Image, amount: int = 2) -> Image.Image:
    """
    Color decontamination / defringing for hair and fine edges.
    Eliminates background color halos by inpainting / extending the true foreground
    hair color into the semi-transparent border pixels while preserving alpha.
    """
    img_np = np.array(rgba_img)
    if img_np.shape[2] != 4:
        return rgba_img

    rgb = img_np[:, :, :3]
    alpha = img_np[:, :, 3]

    # Mask of semi-transparent edge pixels (fringe zone)
    # Fully transparent: alpha == 0
    # Semi-transparent fringe: 0 < alpha < 245
    # Solid foreground: alpha >= 245
    fringe_mask = ((alpha > 0) & (alpha < 245)).astype(np.uint8) * 255

    if np.sum(fringe_mask) == 0:
        return rgba_img

    # Use OpenCV inpaint to extend the solid foreground colors into the fringe pixels
    # Inpaint radius based on defringe amount (typically 2 to 4 pixels)
    decontaminated_rgb = cv2.inpaint(rgb, fringe_mask, inpaintRadius=amount, flags=cv2.INPAINT_TELEA)

    # Recombine decontaminated RGB with original alpha
    result_np = np.dstack((decontaminated_rgb, alpha))
    return Image.fromarray(result_np)

print("Defringe function defined")
