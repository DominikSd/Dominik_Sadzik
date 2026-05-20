# Deployment Checklist

- Run `npm test`.
- Run `npm run format:check`.
- Run `npm run build`.
- Confirm `postbuild` secret scan passes.
- Apply Supabase migrations.
- Confirm `sites` contains the target site.
- Confirm first owner exists in `site_members`.
- Confirm `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SITE_ID` are set.
- Confirm `VITE_GA_MEASUREMENT_ID` is set as a GitHub Actions variable if GA4 tracking is enabled.
- Confirm Supabase Edge Function secrets are set:
  - `GA4_PROPERTY_ID`
  - `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
- Deploy `ga4-report` Edge Function.
- Log in to the admin panel.
- Save a draft and publish one harmless text change.
- Open `Statystyki` and verify the GA4 report status.
