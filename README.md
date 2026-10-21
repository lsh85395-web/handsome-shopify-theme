# Handsome Shopify theme

An original, editable Shopify Online Store 2.0 theme for the Handsome footwear concept. It is based on Dawn 16 and uses original generated images and a custom Handsome SVG mark. The Taiga Askel demo informed the page structure and proportions; no paid Taiga code, images, fonts, testimonials, or copy are included. The Dawn license is retained in `LICENSE.md`.

## Pages and data

- `index.json`: hero, product rails, brand statement, feature cards, editorial media, hotspots, specifications, notes, comparison, newsletter.
- `collection.json`: collection banner, category links, native Shopify filters/sort and product grid, editorial blocks.
- `product.json` and `product.campaign.json`: Shopify product gallery, variant selector, quantity, add to cart, inventory behavior, related products and editorial sections.
- `cart.json`, `search.json`, `page.about.json`, `page.faq.json`, `page.support.json`, `page.contact.json` and Dawn account/policy templates.

Product title, price, images, variants and stock come from **Shopify Products**. Product membership comes from **Shopify Collections**. The product rails select collections in the theme editor. If no footwear records exist, the rails will show an explicit setup prompt; they will never show a fabricated price. The included campaign photographs are theme assets for editorial sections, not product media.

## Editing in Shopify

1. In **Online Store → Themes**, open **Customize** on the Handsome draft. Select a page from the top template selector. Drag sections to change order and use each section's controls for text, images, desktop/mobile hero media, buttons, links and repeated blocks.
2. Edit the shared **Header** and **Footer** in the theme editor. They use Shopify navigation menus (`main-menu` and `footer` by default). Change menu items at **Content → Menus** (or **Online Store → Navigation**, depending on the admin layout).
3. Edit product records at **Products**. Upload product media and set options/variants, price and inventory there. Edit which items appear together at **Products → Collections**. Configure storefront filters with Shopify Search & Discovery if available.
4. Create pages in **Online Store → Pages** and assign template `page.about`, `page.faq`, `page.support` or `page.contact`. Set handles and menu links to the actual pages. The supplied home links assume the handles `our-story` and `contact`; update them in the editor if different.
5. The default `collection.json` is shared by every collection. For a distinct banner/layout, create a second collection template in the theme editor and assign it to that collection in the collection admin. The collection title/description in the shared banner are dynamic Shopify data.
6. The default `product.json` is shared by products. Assign `product.campaign` only where a separate campaign layout is wanted. Shared template edits affect every record assigned to that template.

## Operational notes

- This theme does not configure payments, domain, tax, shipping, policies or store identity. The store owner must verify those settings before accepting orders.
- The homepage product rails initially use the `all` collection. Point them to footwear collections after demo or real products are in Shopify.
- Hero/editorial theme images can be replaced in Customize. Product media belongs in the product record.
- Do not publish a draft theme until its store preview has passed desktop/mobile checks and the store owner explicitly approves publication.
- See `REFERENCE-MAP.md` for the inspected reference-to-section mapping and `DEPLOYMENTS.md` for upload records.

## Validation and recovery

Run `node validate-handsome.mjs` from this directory for a limited local JSON/reference check. Install the pinned official CLI with `npm install`, then run `npm run theme:check` for Shopify Theme Check. A real store preview is a separate required check; the local check cannot replace it. Restore code with a Git commit checkout/revert on the `codex/handsome-askel` branch. Restore the previous storefront by selecting the prior theme in Shopify **Online Store → Themes**; do not delete it.
