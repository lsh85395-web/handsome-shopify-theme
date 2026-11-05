# Home integration

Base: a99e171. Existing Shopify sections, product route and checkout are retained. This is an unpublished review change, not approval to publish.

## Changes

- Visible order: existing H01/H02 hero, H03 philosophy, six existing real-font signature cards, three-step explanation, existing lifestyle artwork, existing brand story, core FAQ, closing invitation, existing global footer.
- Accurate detail imagery is not available. The former concept detail banner is disabled in its intended position rather than presented as verified product detail or fabricated hotspots.
- Category rail, full home customizer, demo showcase, gift hero and trust strip retain their configuration but are disabled. Their assets and sections have not been deleted.
- Signature cards use the existing six font assets and Aina; all link to the existing product customization anchor, with no state writes or automatic style application. Mobile signature and lifestyle rails have swipe hints and visible position feedback.
- Desktop steps have keyboard-accessible tabs (arrows/Home/End); mobile and no-JavaScript show all steps sequentially. No full duplicate home customizer is added.
- FAQ uses existing device, personalization and contact answers. Native details/summary work without JavaScript. Full help links use the existing support page alternate views.
- Closing invitation reuses the previous closing hero copy without unapproved H12 artwork.
- Text is merchant editable. New components use scoped CSS and vanilla JavaScript; shared CSS, product data, stock, prices and checkout are untouched.

## Asset differences and review gates

- H01/H02/H03 remain concept artwork, with explicit disclosure. They are not verified SKU photographs.
- H04/H05/H06 and H12 have baked names different from the required Aina, so are not newly used. H07 also contains a different baked name. H09/H10 require product/name review. Existing lifestyle visuals are retained and explicitly identified as concept artwork, not customer photographs or included props.
- No new actual-product performance, fit, material, shipping, returns or stock claim was invented. No true close-up hotspots are implemented until device-specific photography is verified.
- Existing brand-story wording and image remain; neither the preview's Chinese proposal nor invented branding replaces them.
- Source comparison: frozen v8 HTML/CSS and supplied asset contact sheet inspected. Rendered desktop/mobile reference comparison was initially blocked by sandbox Chromium socket permissions; this is not evidence of exact visual matching. Parent will append any successful alternate rendering/QA.

## Verification

- JavaScript syntax: node --check passed.
- All changed section schemas and index JSON parse successfully; current index block settings match section schema IDs.
- Official Shopify full-theme validator: all nine changed homepage code files PASS. Bundled fallback schemas were used because the normal cache directory was unavailable.
- LiquidJS + jsdom: ten checks PASS, including keyboard tabs, mobile sequential steps, six Aina card links, FAQ structure and absence of storage/network mutation. This is DOM testing, not real-browser or real-device testing.
- Parent coordinates actual desktop/mobile runtime and screenshot QA. No live order, payment or production publish performed.
