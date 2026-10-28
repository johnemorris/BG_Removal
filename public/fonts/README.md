# Inter, served locally

These seven variable WOFF2 subsets are the exact Inter 100–900 normal font
bytes downloaded by the baseline Next 14 Google Fonts build. They retain the
Latin, Latin extended, Cyrillic, Cyrillic extended, Greek, Greek extended and
Vietnamese coverage, unicode ranges, swap display, Arial fallback metrics and
Latin preload from that build. `src/styles/fonts.css` replaces only generated
family names and URL paths. This avoids network access during builds without
changing the typeface or weights.

Upstream: https://fonts.google.com/specimen/Inter
License: SIL Open Font License 1.1, copied from
https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt in `OFL.txt`.
Do not edit font binaries. Retain the license when redistributing them.
