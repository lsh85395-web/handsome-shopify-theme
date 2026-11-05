# Lumasela version 8 integration review

Prepared 2026-11-05 from branch `codex/lumasela-asset-integration-20261105`, base commit `a99e17167c76540bfaea68389375ef29df80e342`. Original Shopify Dawn architecture is retained. This version is for the existing unpublished QA theme only; publication requires approval of this specific version.

## Preserved source of truth

| Item | Source / implementation | Result |
| --- | --- | --- |
| Product | Shopify `signature-clear`, product ID 15562989830432, template `lumasela` | ACTIVE demonstration listing, not a production-verified SKU |
| Price | Shopify selected variant | MYR 29.99 on all audited variants; now formatted with Shopify currency filter |
| Variants | Shopify product options / variant IDs | 3 case types × 6 device choices × Clear, 18 existing combinations preserved |
| Availability | Shopify inventory | All 18 variants zero inventory with DENY policy; sold-out submission remains blocked |
| Original media | Shopify product media | Existing demo image retained; every original additional media entry is retained if present |
| Lettering | Existing packaged fonts and personalization snippet | Allura, Dancing Script, Great Vibes, Sacramento, Kaushan Script, Knewave; unchanged |
| Personalization | Existing controls | 20-character limit, 4 positions, 35/50/65 mm design labels, 4 text colours, 6 phone-colour previews preserved. Production dimensions and font licensing still require verification |
| Cart/order parameters | Existing native Shopify product form | Variant, quantity, Signature name/style/position/size, Text colour, Preview phone colour retained |
| Cart, checkout, SEO, contact | Existing Dawn routes/layout/native contact form | No payment, order, product record, policy, tracking or account settings modified |

## New integration

- Capsule navigation uses the frozen desktop/mobile dimensions, the original logo and N01 artwork. Main tasks open independent destinations; cart/search remain functional native routes.
- Homepage uses existing hero and philosophy, six actual-font inspiration cards, three steps, lifestyle, existing brand story, FAQ and closing CTA. Prior duplicate/customizer/category settings are retained disabled.
- Product gallery retains actual media and adds five clearly identified concept secondary images only for the tagged demo product. Zoom, keyboard dialog dismissal and focus restoration are included.
- Product design choices are saved in tab-scoped sessionStorage per product. Names are not added to URLs or sent to new services. Gallery browsing and middle-page examples do not overwrite selections.
- Product middle order: signature sample, verified-data guidance, three steps, lifestyle, FAQ, return to customization. The desktop gallery remains sticky; the options column remains scrollable. The mobile review bar hides during input/keyboard use and does not submit a cart request.
- Guide/FAQ/tracking use existing `/pages/support?view=customize`, `?view=faq`, `?view=track` alternate templates. No store-wide page record was created. Contact stays `/pages/contact-us`; tracking uses the existing account order route and order confirmation email instructions.

## Deliberate gaps requiring review

- No verified device-specific product close-ups exist. Accurate hotspots are not fabricated. Existing detail configurations are preserved disabled.
- Supplied artwork is concept imagery, not evidence of SKU fit, case construction, durability, magnetic compatibility or manufacturing capability.
- H04–H07/H09/H10/H12 have naming or product-review concerns and are not newly shown. The original brand narrative is preserved rather than replaced with the preview proposal.
- Font license evidence, physical print area, supported manufacturing characters, shipping and refund details still need verification. Existing controls are not proof of production readiness.
- Mobile bar hiding when the purchase button is onscreen was not silently adopted. It remains visible unless editing; review is needed before any additional visibility optimization.

## Verification and limits

- Official Shopify Theme Check validates the complete changed theme-file set using bundled fallback schema/docs because the environment cannot write its normal cache directory.
- Navigation: 12 simulated DOM checks passed. Homepage: 11 simulated DOM checks passed.
- Product: 11 simulated DOM regression groups passed, including full session restore, variant and property integrity, gallery/zoom, repeated phone-colour changes and invalid submissions. Reproducible test: `NODE_PATH=<directory containing liquidjs and jsdom> node scripts/test-product-interactions.cjs`. Final upload/read-back results are recorded in the deployment entry.
- This execution environment cannot launch Chromium (socket restriction and an independent mount failure). Independent browser review found 500px signature-rail overflow and low-contrast hero secondary text; scoped fixes were prepared for retest. No real-phone, cross-browser, payment or end-to-end order test is claimed.
- Actual QA storefront HTTP checks passed for home, product, guide, FAQ, tracking, contact and cart: all seven HTTP 200, expected QA theme ID/unpublished role, no Liquid errors. All 35 discovered Lumasela resources returned HTTP 200 with nonempty bodies. The native contact form was inspected but not submitted.
- Actual product HTML confirms the original /cart/add form, six personalization properties, six gallery thumbnails, six fonts, four placements, 18 variants and zero available variants.
- No real test order, notification, payment or contact submission was made.

## Rollback

The pre-change branch commit is `a99e17167c76540bfaea68389375ef29df80e342`. A full pre-upload QA text backup and per-file checksums were recorded before editing. Re-upload the backed-up files to QA to restore that exact theme state; retain unused new assets rather than deleting store data. The MAIN theme `193306427680` remains untouched throughout, so production does not require rollback for this QA iteration.
