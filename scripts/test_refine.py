import cv2
import numpy as np
from PIL import Image
import rembg
from rembg import new_session

def refine_cutout(
    rgba_img: Image.Image,
    defringe_amount: int = 2,
    edge_shift: int = -1,  # negative chokes the edge to eliminate halo
    edge_feather: float = 0.5
) -> Image.Image:
    img_np = np.array(rgba_img)
    if img_np.shape[2] != 4:
        return rgba_img

    rgb = img_np[:, :, :3].copy()
    alpha = img_np[:, :, 3].copy()

    # 1. Edge Shift / Choke (Negative = shrink mask to eat grey/white fringes)
    if edge_shift != 0:
        kernel_size = abs(edge_shift) * 2 + 1
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
        if edge_shift < 0:
            alpha = cv2.erode(alpha, kernel, iterations=1)
        else:
            alpha = cv2.dilate(alpha, kernel, iterations=1)

    # 2. Edge Feathering / Smoothing
    if edge_feather > 0:
        k_size = int(edge_feather * 4) | 1  # must be odd
        if k_size >= 3:
            alpha = cv2.GaussianBlur(alpha, (k_size, k_size), edge_feather)

    # 3. Color Decontamination / Defringe
    # Extends the true interior hair color into the semi-transparent fringe zone
    if defringe_amount > 0:
        fringe_mask = ((alpha > 0) & (alpha < 240)).astype(np.uint8) * 255
        if np.sum(fringe_mask) > 0:
            rgb = cv2.inpaint(rgb, fringe_mask, inpaintRadius=max(1, defringe_amount), flags=cv2.INPAINT_TELEA)

    result_np = np.dstack((rgb, alpha))
    return Image.fromarray(result_np)

print("Refinement logic ready")
