# Deployment Checklist

- Run `npm test`.
- Run `npm run format:check`.
- Run `npm run build`.
- Confirm `postbuild` secret scan passes.
- Confirm `/robots.txt` points only to `https://dominik-sadzik.pl/sitemap.xml`.
- Confirm `/sitemap.xml` returns `200` and lists only clean canonical URLs without `#`.
- In Google Search Console submit `sitemap.xml` and remove any old `sitemap-main.xml` submission.
- Apply Supabase migrations.
- Confirm `sites` contains the target site.
- Confirm first owner exists in `site_members`.
- Confirm GitHub Actions Variables are set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SITE_ID`
  - `VITE_ADMIN_HASH_PATH`
  - `VITE_GA_MEASUREMENT_ID`
- Confirm Supabase Edge Function secrets are set:
  - `GA4_PROPERTY_ID`
  - `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
  - `RESEND_API_KEY` if email notifications from the website description form are enabled
  - `BRIEF_NOTIFICATION_EMAIL` if email notifications from the website description form are enabled
  - `BRIEF_FROM_EMAIL` if email notifications from the website description form are enabled
- Deploy `ga4-report` Edge Function.
- Deploy `website-brief-submit` Edge Function after form or email-notification changes.
- For GitHub Pages, confirm `Settings -> Pages -> Enforce HTTPS` is enabled.
- Remember that GitHub Pages does not provide a simple project-level way to set custom HTTP
  security headers like `X-Frame-Options`, `Permissions-Policy` or a strict CSP. Add these later if
  the site moves to Netlify, Vercel, Cloudflare Pages or another host that supports them.
- Log in to the admin panel.
- Save a draft and publish one harmless text change.
- Open `Statystyki` and verify the GA4 report status.
