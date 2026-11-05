# Supplied artwork integration (2026-11-05)

This file records the source of the owner's ZIP artwork and its current use. The original ZIPs remain in the owner's Downloads folder. `docs/supplied-asset-inventory.json` records each source entry, SHA-256 digest, imported theme asset and status. `scripts/import_supplied_assets.py` recreates the optimized assets without changing product records.

| Source | Theme asset | Intended placement | Current status |
| --- | --- | --- | --- |
| H01 | `lumasela-h01-hero-desktop.webp` | Home hero, desktop | Wired in `templates/index.json` |
| H02 | `lumasela-h02-hero-mobile.webp` | Home hero, mobile | Wired through the H01 fallback in `sections/lumasela-hero.liquid` |
| H03 | `lumasela-h03-clear-philosophy.webp` | Home product philosophy | Wired in `templates/index.json` |
| H04–H06 | `lumasela-h04-*`, `lumasela-h05-*`, `lumasela-h06-*` | Home signature inspiration | Imported only. The baked names differ from the previously requested consistent sample name “Aina”; replacing the lettering requires approved source artwork or an image edit. |
| N01 | `lumasela-n01-navigation-panel.webp` | Navigation panel art | Integrated in the unpublished QA capsule menu using the supplied local reference source; rendered visual acceptance remains pending. |
| Support images and icons | `lumasela-*` assets from the support ZIP | Guide, FAQ, tracking and contact pages | Three guide SVGs used in the independent customization view. Other imported assets remain available but are not automatically shown. Verified existing support/contact routes are preserved. |
| P02–P07, P14 | `lumasela-p02-*` etc. | Product gallery, signature sample, lifestyle | Integrated as explicitly labelled concepts for the tagged demo product and review content. No actual SKU media were replaced. |
| H07–H11, P08–P13, P15 | `lumasela-h07-*` etc. | Other home/product concepts | Imported but not newly presented as verified product details. Accurate hotspots remain incomplete. |
| H12 | `lumasela-h12-closing-cta.webp` | Home closing CTA | Imported only. Its baked name “Adam” conflicts with the consistent sample name. |

All imported product artwork is owner supplied concept imagery, not evidence of device fit, material, durability, manufacturing capability, or stock. Live product media and price still come from Shopify product records. The integration through commit `c9e3a7d48c1f38413708166c3c646ac9485c1c67` was uploaded to QA theme `193315438880` and read back by MD5. It remains unpublished; MAIN is unchanged.

## Validation still needed

- The supplied local preview sources have been inspected. Complete rendered desktop/mobile comparison and device testing before approval.
- The actual Shopify QA HTML and resources are checked separately; browser screenshots remain unavailable because the execution environment cannot launch Chromium.
- Resolve sample-name differences in H04–H06/H12 before showing them to customers.
- Guide, FAQ and tracking use alternate views of the verified existing support page. Creating permanent dedicated page records is a separate publish-stage decision.
