# Theme deployment record

| Date (Asia/Shanghai) | Git commit | Store | Theme ID | Status | Scope |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04 13:25 | `8e28215723402dda54c326698cfc6619a27a80d7` | `cfrzux-ne.myshopify.com` | `193306427680` | Unpublished draft | Product studio, home and collection links, About hero, footer menus and brand label. Uploaded by selective `shopify theme push --only ... --nodelete --strict`; the final uploads returned `Theme upload complete`. |
| 2026-11-04 13:39 (verified) | `ad37000dc530cc401199c3fddde269fa628a24c6` | `cfrzux-ne.myshopify.com` | `193306427680` | Live | Published with `shopify theme publish --store cfrzux-ne.myshopify.com --theme 193306427680 --force`. `shopify theme list` reports role `live`; public GETs to home, collection, product, About, Support, Contact, Search and Cart returned HTTP 200. |

The live site is `https://lumasela.com/`. The previously published theme `192777158944` is retained as unpublished and was not changed. Its pre-change backup is at `C:\Users\mokwh\Documents\项目管理\shopify-theme-backups\cfrzux-ne-live-192777158944-20261104-pre-aina`.

The product is a zero-inventory demo. Publishing the theme changed the visible design but did not make the demo product purchasable.
