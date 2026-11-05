# Product page reference fidelity review

Updated 2026-11-05 (UTC). Scope: `product.lumasela` on the unpublished Lumasela QA theme 193315438880. The live theme 193306427680 is not part of this revision.

## Reference and correction

The approved gallery preview and supplied comparison screenshots were inspected directly. The prior QA product page retained the old theme's oversized, heavy headings and square controls, and did not match the approved visual system. This revision corrects that mismatch rather than treating functional checks as visual approval.

- Restore Arial body typography, 37px/500 desktop product title, 32px mobile title, regular 19px live price, and the Georgia italic subtitle.
- Restore the centered 1600px layout, breadcrumb, 1.3fr/1fr main grid, warm portrait gallery, 66px rounded thumbnail rail and upper-right circular zoom control.
- Restore appearance/signature/review grouping, soft rounded options, an open white personalisation form, phone colour swatches and a live configuration summary.
- Keep actual six signature fonts, four placements, three existing size values, colour options, 20-character name limit and native line-item properties. Long font samples are visually ellipsized in their cards only; the input, main preview and submitted property retain the whole permitted name.
- Add keyboard/arrows/dots/swipe image navigation, preserving native zoom dismissal and state restoration. Restore the reference's main-gallery before/after slider, synchronised to the selected phone colour and preserved when zooming.
- Match the lower product-page section headings, steps, FAQ and closing area to the reference's quieter 32px desktop / 25px mobile typography and spacing. These CSS rules are scoped to product pages, not the homepage.

## Deliberately preserved differences

- Original image logo is kept rather than replacing it with the reference's lowercase text wordmark.
- Original product media and the existing supplied concept imagery are retained, not replaced with the reference's drawn phone assets. Product fit, construction and imagery are not newly verified by this work.
- Existing real Shopify options, amount/currency, availability, quantity control and cart form are retained rather than the reference's simulated checkout.
- The main-gallery before/after slider now follows the reference interaction instead of the prior right-column double-image comparison.
- Product-detail hotspots remain incomplete because verified physical close-up materials are unavailable. No invented performance claims or substitute verified-SKU photography were added.

## Validation

- Shopify Liquid/theme validation passed on all seven updated theme files, with follow-up CSS validation after lower-page typography and SVG icon changes.
- Fifteen DOM regression groups pass, covering real option selection, six fonts, four placements, sizes, field limits, persistence, native form properties, sold-out/unavailable guards, quantity checks, zoom, arrows/dots, keyboard/swipes, summary and main-gallery comparison switching, slider clipping, colour sync and zoom preservation.
- Fresh QA storefront HTML was used to exercise all 18 live variant combinations without network/cart writes: four available variants enabled, fourteen unavailable variants disabled, and current prices matched.
- Shopify uploads use only the unpublished QA theme. Every changed file is independently read back and checked against local MD5.
- Independent real-browser checks at 1180px desktop and 500px narrow viewport passed: all six font cards contained a 20-character name; narrow document clientWidth and scrollWidth were both 485px; the input retained all 20 characters; zoom showed the full name and closed with Escape; next/previous/dots wrapped correctly; the main-gallery slider revealed the before image without changing the saved design. Soft TPU was disabled Sold out and Hard PC was enabled as current inventory required. The narrow viewport is not a physical-phone/Safari test. No payment or order was submitted.
- Final lower-page typography and SVG icons passed real-browser checks. The main-gallery slider also passed at 500px and 1181px: 0/25/50/75/100 clipping, actual dragging, hiding on secondary images and restoring on the main image, synchronised colour sources, preserved 20-character design, and matching 50% zoom clipping. Widths remained 485/485 and 1166/1166 (client/scroll). Background attachment was confirmed scroll. The old right-column comparison is removed.

## Store data requiring owner review

At 2026-11-05 05:41 UTC the live Shopify product record had changed since the earlier zero-stock audit: four Hard PC variants each had two units (eight total); other variants had zero inventory. Current prices were MYR29.99 Hard PC, MYR35.99 Soft TPU and MYR39.99 Magnetic. The product remains tagged `demo-product`, and its description still says it has no sellable inventory and production availability is unverified. These records conflict. This revision does not change inventory, prices, tags or Shopify product content, and follows Shopify's actual variant availability. A second stale zero-inventory assertion was found in the theme's demo notice; only that theme assertion was removed, retaining the demo and unverified-details warning.

Shipping/refund/terms policy records remain absent from the earlier policy audit. Those policies, actual production details and real-device/browser coverage are separate unresolved launch matters. Publication of this QA version still requires the owner's approval.
