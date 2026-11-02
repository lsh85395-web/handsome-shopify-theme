# Rollback guide

## GitHub

- Safest: create a revert commit for the deployment commit: `git revert <commit-sha>` and push it.
- To inspect an older version locally: `git switch --detach <commit-sha>`.
- Avoid force-pushing `main`. A revert preserves the audit trail.

## Shopify theme

1. Go to **Online Store → Themes** in the currently connected `lumasela.com` store.
2. The current preview target is **Lumasela Malaysia Preview - Codex**, theme ID `193230930208`, role **UNPUBLISHED**. The live theme is **Handsome Askel Preview**, theme ID `192777158944`.
3. A theme upload changes files only in the named unpublished theme. It does not publish that theme. Confirm both the name and ID before every upload.
4. If a future version is published, use the confirmed prior theme in Shopify Admin to restore it. Shopify moves the displaced theme back into the theme library.
5. Theme content and product/catalog data are separate. Reverting theme code does not revert product, collection, order, payment, shipping or navigation changes.
