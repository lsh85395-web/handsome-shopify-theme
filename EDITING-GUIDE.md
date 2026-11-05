# Lumasela editing guide

## Brand and global styling

1. Open **Lumasela QA 2026-11-04** in **Online Store → Themes → Customize**. Confirm theme ID `193315438880` before editing; it is an unpublished theme.
2. Open **Theme settings → Lumasela brand** to change the brand name and tagline.
3. Use **Theme settings → Logo** to upload a logo and adjust its width. If no image logo is selected, the theme uses the built-in Lumasela wordmark; edit its brand name in the Lumasela brand settings.
4. Use **Theme settings → Colors**, **Typography**, **Buttons**, and **Layout** for global visual changes.

## Homepage copy, images, and section order

1. In the theme editor, choose **Home page** from the page selector.
2. Select a section in the left panel. Every headline, paragraph, label, button and link is editable independently from its image.
3. For each hero, choose separate desktop and mobile images. Leaving them empty uses the packaged no-marketing-text fallback visual.
4. Drag sections in the left panel to change their order. Use the eye icon to hide a section without deleting its settings.
5. The full homepage `Lumasela customizer` is retained disabled. The home buttons now lead to the existing product studio. Do not enable purchasing before product data and fulfillment details are verified.
6. The previous `Lumasela featured showcase` is retained disabled so its configuration remains recoverable; the approved home layout does not add a category or demo-product shelf.

## Products, collections, and personalized order data

1. Product title, description, images, variants, price, inventory and status are edited in **Products**.
2. The default product template is already Lumasela-branded. Use **product.lumasela** only when a separate template assignment is useful for migration or testing.
3. The active Lumasela product studio submits `Signature name`, `Signature style`, `Signature position`, `Signature size`, `Text colour`, and `Preview phone colour` as line-item properties. Review these with the variant and quantity before selling. A real test order requires separate authorization.
4. Edit collection membership and collection images in **Products → Collections**. The collection page reads this Shopify data automatically.
5. The `signature-clear` listing is ACTIVE but explicitly a demo. All 18 variants have zero inventory and DENY policy. Confirm real product ownership, specifications, compatibility, media, inventory and fulfillment before accepting orders.

## Navigation and footer

1. Edit menu destinations at **Content → Menus** (or **Online Store → Navigation** in older admin layouts).
2. In the theme editor, open **Header** and select the desired Shopify menu.
3. Open **Footer** to configure newsletter, policies, payment icons and footer blocks.
4. The packaged footer reads the Shopify menus `main-menu` and `footer`. Theme code does not create or translate those store-level menus.

## Replacing packaged images

- Hero: open each `Lumasela hero` section and replace Desktop image and Mobile image.
- Category cards: open `Lumasela category rail`, select each card and replace Image.
- Homepage products: select the real Shopify collection in `Lumasela featured showcase`; product media and prices are not theme images or copy.
- Signature cards: open `Lumasela signature styles` and replace Product image.
- Lifestyle cards: open `Lumasela media grid`, select each card block, and replace Image.
- Detail/brand story: replace Image in `Lumasela detail banner` and `Lumasela editorial split`.
- Product gallery media belongs in the Shopify product record, not in theme code.

## Before accepting orders

Verify a real phone-case product, variants, SKU, price, inventory, shipping weight, tax category, product media, customization safe area, production time and returns policy. With explicit authorization, place a safe test order and confirm all six studio properties, the variant and quantity appear on the cart and order line item.

Also confirm **Settings → Markets**, **Payments**, **Shipping and delivery**, **Taxes and duties**, **Policies**, customer contact details and the Malaysia domain experience. Displaying MYR in the theme is not evidence that these store-level settings are complete.
