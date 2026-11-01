# Rollback guide

## GitHub

- Safest: create a revert commit for the deployment commit: `git revert <commit-sha>` and push it.
- To inspect an older version locally: `git switch --detach <commit-sha>`.
- Avoid force-pushing `main`. A revert preserves the audit trail.

## Shopify theme

1. Go to **Online Store → Themes**.
2. The Lumasela upload is kept unpublished. The current live theme remains unchanged.
3. To discard the preview, use the unpublished theme's menu and choose **Remove** only after confirming the theme ID.
4. If a future version is published, use the prior theme's menu and choose **Publish** to restore it. Shopify will move the displaced theme back into the theme library.
5. Theme content and product/catalog data are separate. Reverting theme code does not revert product, collection, order, payment, shipping or navigation changes.
