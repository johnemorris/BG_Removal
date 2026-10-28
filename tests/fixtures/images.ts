// Synthetic RGBA inputs: deterministic, tiny and free of model dependencies.
export function rgba(width: number, height: number, alpha: (x: number, y: number) => number) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      data.set([220, 70, 40, alpha(x, y)], (y * width + x) * 4);
    }
  }
  return data;
}
