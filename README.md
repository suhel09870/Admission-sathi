# Admission-sathi
Admission Saathi - College Admission Platform

## Supabase setup

The frontend reads college data from the `colleges` table in the configured Supabase project. Put the browser-safe publishable/anon key in `js/config.js`:

```js
window.SUPABASE_CONFIG = {
	url: 'https://thbmnrkqjzrzempqyyjz.supabase.co',
	anonKey: 'your-publishable-or-anon-key'
};
```

Only use a publishable/anon key in this browser app. Never put a `service_role` key, secret key, or database password in `js/config.js` or commit one to the repository.

### GitHub Pages deployment

The GitHub Pages workflow creates the ignored `js/config.js` only inside the deployment artifact. In the repository settings, add an Actions secret named `SUPABASE_ANON_KEY` containing the browser-safe publishable/anon key. In Pages settings, set the source to **GitHub Actions**. Pushing to `main` then deploys the site with the generated configuration while keeping the key out of Git history.

The workflow keeps the existing Supabase project URL and fails if `SUPABASE_ANON_KEY` is not configured. Do not use a `service_role` key, secret key, or database password.

The app uses only fields present in the live schema. Course filtering uses the nullable `course` text field, and affiliation filtering uses `affiliation`. Unsupported demo-only category and fee-range filters are not available. Null optional fields remain empty, and a missing `application_url` shows the existing unavailable-link message.
