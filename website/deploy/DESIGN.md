# Clear glass visual direction

The September 28 revision replaces the warm layer with `assets/clear.css`.
The subsequent typography revision adds `assets/type.css` and removes the
large hero logo object. The logo is retained in the navigation, footer and icons.
The existing `warm.css` is retained for history but is no longer loaded.

- Neutral white and cool gray surfaces; restrained blue reflections.
- Original Wayne Club Sketch logo remains unchanged.
- The hero now uses typography and whitespace instead of a logo sculpture.
- A dedicated globe button in the navigation opens the three-language selector;
  selection uses the existing persisted language and analytics change handlers.
- Inter Variable, Noto Sans TC Variable and Noto Sans SC Variable are self-hosted
  with `font-display: swap`, unicode-range subsets and system sans-serif fallback.
  Package versions and OFL licenses are retained under `assets/fonts/`.
- No continuous animation, external stock-photo dependency or third-party
  interactive script. Reduced motion disables pointer perspective; reduced
  transparency uses opaque surfaces.
- Glass controls sit above simple content; project cards and typography remain
  readable in both appearances. Social sharing imagery uses the same palette.

References researched (not redistributed assets):
- Apple Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Apple Meet Liquid Glass: https://developer.apple.com/videos/play/wwdc2025/219/
- Prism/light photographic reference: https://unsplash.com/photos/a-prism-refracts-light-into-a-rainbow-spectrum-a18lCneoV4E

There are no hero images. The previous `glass.js` is retained in source history
but is not loaded. Font files can be refreshed using `scripts/vendor-fonts.cjs`
with a directory containing the three Fontsource variable-font packages.
