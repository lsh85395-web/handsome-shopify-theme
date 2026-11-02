# Rollback guide

## GitHub

- Safest: create a revert commit for the deployment commit: `git revert <commit-sha>` and push it.
- To inspect an older version locally: `git switch --detach <commit-sha>`.
- Avoid force-pushing `main`. A revert preserves the audit trail.

## Shopify theme

1. Go to **Online Store → Themes** in the currently connected `lumasela.com` store.
2. No Shopify theme upload was performed for the current local changes.
3. If an older preview needs removal, confirm its theme ID in the current store first. The previous record for `195715891565` is stale and must not be assumed to identify a current theme.
4. If a future version is published, use the confirmed prior theme in Shopify Admin to restore it. Shopify moves the displaced theme back into the theme library.
5. Theme content and product/catalog data are separate. Reverting theme code does not revert product, collection, order, payment, shipping or navigation changes.
