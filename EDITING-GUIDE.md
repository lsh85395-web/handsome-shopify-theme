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
5. The `Lumasela customizer` section has a **Product** picker. Leave it empty for design-preview mode. Select a verified phone-case product only when its variants, price, media and fulfillment details are ready.
6. The `Lumasela featured showcase` section has a **Collection** picker. When a published collection is selected, the cards use real Shopify product data and quick add. Without one, the section shows clearly marked preview cards.

## Products, collections, and personalized order data

1. Product title, description, images, variants, price, inventory and status are edited in **Products**.
2. The default product template is already Lumasela-branded. Use **product.lumasela** only when a separate template assignment is useful for migration or testing.
3. The Lumasela customizer adds `Signature name`, `Signature style`, `Signature color`, and `Signature position` as line-item properties. Check these values in the cart and in a Shopify test order before selling.
4. Edit collection membership and collection images in **Products → Collections**. The collection page reads this Shopify data automatically.
5. The current store has three draft demo phone-case listings under VAULTA. Do not relabel or publish them as Lumasela products without confirming product ownership, specifications, compatibility, imagery, inventory and fulfillment.

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

Verify a real phone-case product, variants, SKU, price, inventory, shipping weight, tax category, product media, customization safe area, production time and returns policy. Then place a test order and confirm the four personalization fields appear on the cart item and order line item.

Also confirm **Settings → Markets**, **Payments**, **Shipping and delivery**, **Taxes and duties**, **Policies**, customer contact details and the Malaysia domain experience. Displaying MYR in the theme is not evidence that these store-level settings are complete.
