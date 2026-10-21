# Handsome preview QA — 2026-10-21 UTC

Store: `cfrzux-ne.myshopify.com`; draft theme: `192777158944` (`Handsome Askel Preview`). The live theme remained `192658702624` (`Nexglee Stage 1 - e0deecf`) after the final upload. The store is password protected; the owner entered its password directly in the browser for the independent mobile check. The password was never copied into this repository.

## Opened in the actual Shopify preview

| Surface | Result |
| --- | --- |
| Home, collection, product, cart, search, footer, Our Story, FAQ, Support, Contact | Opened in the signed-in desktop browser. Shopify-backed links and page sections rendered. |
| Home, collection, product at 390 × 844 | Opened in a separate password-unlocked browser. `window.innerWidth` was 390; `document.documentElement.scrollWidth` was 380 on all three pages, so no page-wide horizontal overflow was found. Story, FAQ, Support, Contact and Cart were also opened on mobile with no page-wide overflow. |
| Desktop/mobile navigation | Desktop links and mobile drawer opened. Home and footer links pointed to the Handsome collection and content pages. |
| Collection filtering/sorting | Native desktop sort changed product order and URL; mobile Filter and sort drawer opened with Availability, Price, Sort by and Apply controls. The category chip row scrolls horizontally within its own area. |
| Search | Desktop search returned Shopify records. Mobile search for `Trail` returned the two Handsome demonstration products. Existing active Nexglee records can also surface for broader queries. |
| Product | Live Shopify image, title, RM price, variants and sold-out state rendered. Selecting US 9 on desktop and mobile updated the selected variant and URL. Out-of-stock add-to-cart and accelerated checkout were disabled; the disabled accelerated button was visually dimmed after a fix. |
| Cart/checkout path | Using a pre-existing in-stock Nexglee demo in the signed-in desktop test session, quantity changed from 1 to 2 and total from RM249 to RM498. Checkout opened; no payment or order was submitted. The test item was then removed from that session. Shopify checkout displayed: “This store can't accept payments right now.” |
| Empty cart | Continue shopping opened `/collections/handsome-demo-shoes` after a fix. |
| FAQ/Support/Contact | FAQ accordion expanded; Support-specific question rendered after a fix; Contact showed a Shopify contact form. No message was submitted. |
| Theme Check | 0 errors and 8 warnings after final push. Warnings are in inherited Dawn theme files; see CLI output if investigating them. Local JSON/schema/reference validator and `git diff --check` passed. |

Six final viewport/page screenshots are in `qa-screenshots/`: `home-desktop-viewport.png`, `home-mobile.png`, `collection-desktop-viewport.png`, `collection-mobile.png`, `product-desktop-viewport.png`, and `product-mobile-full.png`.

## Operational limits before launch

- The two Handsome shoes are clearly marked demonstration products, priced RM0.00 and at zero inventory. Their imagery and details are illustrative. Replace them with approved product records before launch.
- The store's currency is MYR although the intended market is the United States. The owner must review currency/Markets, payment activation, shipping, tax, domain, policies and store identity. None of those global settings were changed by this project.
- Existing active Nexglee demonstration products remain in Shopify search. Decide whether to archive or unpublish them when the previous catalog is no longer needed.
- The mobile screenshot session had an existing cart badge with one item after the owner unlocked the store. That separate browser cart was left untouched.
- The Taiga Askel demo guided structure and spacing; this theme uses original Handsome media, mark and copy instead of licensed Taiga assets or code. Exact visual parity is not claimed.
