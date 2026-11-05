# Supplied artwork integration (2026-11-05)

This file records the source of the owner's ZIP artwork and its current use. The original ZIPs remain in the owner's Downloads folder. `docs/supplied-asset-inventory.json` records each source entry, SHA-256 digest, imported theme asset and status. `scripts/import_supplied_assets.py` recreates the optimized assets without changing product records.

| Source | Theme asset | Intended placement | Current status |
| --- | --- | --- | --- |
| H01 | `lumasela-h01-hero-desktop.webp` | Home hero, desktop | Wired in `templates/index.json` |
| H02 | `lumasela-h02-hero-mobile.webp` | Home hero, mobile | Wired through the H01 fallback in `sections/lumasela-hero.liquid` |
| H03 | `lumasela-h03-clear-philosophy.webp` | Home product philosophy | Wired in `templates/index.json` |
| H04–H06 | `lumasela-h04-*`, `lumasela-h05-*`, `lumasela-h06-*` | Home signature inspiration | Imported only. The baked names differ from the previously requested consistent sample name “Aina”; replacing the lettering requires approved source artwork or an image edit. |
| N01 | `lumasela-n01-navigation-panel.webp` | Navigation panel art | Imported only. The private navigation reference is inaccessible in this environment, so its exact crop and composition have not been verified. |
| Support images and icons | `lumasela-*` assets from the support ZIP | Guide, FAQ, tracking and contact pages | Imported only. Shopify page records and current customer-facing content need verification before linking them from the navigation. |
| H07–H11, P07–P15 | `lumasela-h07-*` etc. | Later home/product sections | Imported; section editor can select these assets. Not placed until section order and product factual accuracy can be checked against the approved private preview. |
| H12 | `lumasela-h12-closing-cta.webp` | Home closing CTA | Imported only. Its baked name “Adam” conflicts with the consistent sample name. |

All imported product artwork is owner supplied concept imagery, not evidence of device fit, material, durability, manufacturing capability, or stock. Live product media and price still come from Shopify product records. No change in this branch has been uploaded to Shopify or published.

## Validation still needed

- Open the approved private Sites previews (main version 8 and navigation version 2) or receive screenshots/source exported from them. Current Sites connector calls fail at transport level.
- Check the H01/H02 hero and H03 image/text section at desktop and mobile widths in an actual Shopify preview. The CLI/connector could not establish a working preview session here.
- Resolve sample-name differences in H04–H06/H12 before showing them to customers.
- Confirm any new support-page links against actual Shopify page records.
