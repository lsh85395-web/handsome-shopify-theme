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
2. Edit the shared **Header** and **Footer** in the theme editor. They use separate Shopify menus `handsome-main`, `handsome-help` and `handsome-about` (created for this theme). Change items at **Content → Menus**. Header/footer changes affect every page using this theme.
3. Edit product records at **Products**. Upload product media and set options/variants, price and inventory there. Edit which items appear together at **Products → Collections**. Configure storefront filters with Shopify Search & Discovery if available.
   The empty-cart **Continue shopping** links and the default product breadcrumb use **Customize → Theme settings → Cart → Collection**. Point this to the replacement footwear collection when changing the catalog.
4. The page records **Handsome Our Story**, **Handsome FAQ**, **Handsome Support** and **Handsome Contact** use handles `handsome-our-story`, `handsome-faq`, `handsome-support` and `handsome-contact`. Edit each page's title and body at **Online Store → Pages**. On this draft, Shopify did not retain a custom page-template assignment, so `page.json` routes these four handles to the relevant editable section content; other pages still show their ordinary Shopify page body. Edit the shared router's headings, images, buttons and question blocks in **Customize → Default page → Handsome content pages**. Its settings affect these four Handsome pages. Dedicated `page.about`, `page.faq`, `page.support` and `page.contact` templates are also included for future individual assignments.
5. The default `collection.json` is shared by every collection. For a distinct banner/layout, create a second collection template in the theme editor and assign it to that collection in the collection admin. The collection title/description in the shared banner are dynamic Shopify data.
6. The default `product.json` is shared by products. Assign `product.campaign` only where a separate campaign layout is wanted. Shared template edits affect every record assigned to that template.

## Operational notes

- This theme does not configure payments, domain, tax, shipping, policies or store identity. The store owner must verify those settings before accepting orders.
- The homepage and product rails use the manual `Handsome Demo Shoes` collection. Its two zero-stock, RM 0.00 demonstration products are clearly marked not for sale and must be replaced before launch. The store currency is MYR in Shopify even though the intended market is the US; changing this is an owner-level store decision.
- Existing active Nexglee demonstration products remain in this store. Shopify search can surface them even though the Handsome homepage and collection rails show footwear. Archive or unpublish those records only after the owner decides how the previous catalog should be handled.
- Hero/editorial theme images can be replaced in Customize. Product media belongs in the product record.
- Do not publish a draft theme until its store preview has passed desktop/mobile checks and the store owner explicitly approves publication.
- See `REFERENCE-MAP.md` for the inspected reference-to-section mapping and `DEPLOYMENTS.md` for upload records.

## Validation and recovery

Run `node validate-handsome.mjs` from this directory for a limited local JSON/reference check. Install the pinned official CLI with `npm install`, then run `npm run theme:check` for Shopify Theme Check. A real store preview is a separate required check; the local check cannot replace it. Restore code with a Git commit checkout/revert on the `codex/handsome-askel` branch. Restore the previous storefront by selecting the prior theme in Shopify **Online Store → Themes**; do not delete it.
