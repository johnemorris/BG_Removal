# Deterministic image fixtures

`product.png` and `cutout.png` are synthetic 8×6 RGBA PNGs. A solid red-orange
4×4 rectangle occupies x=[2,6), y=[1,5). The original has an opaque light gray
background; the cutout has transparent background pixels. They contain no
personal data, remote references, metadata, or model-generated pixels.

`images.ts` builds small raw RGBA arrays for alpha-threshold, opaque, empty,
and single-pixel unit cases. Unit canvas doubles supply these bytes directly;
they do not claim to verify browser rasterization or downsampling accuracy.
The smoke check decodes the actual PNGs in Chromium.
