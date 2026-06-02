# GA4 Setup

## 1. Create GA4 Web Stream

1. Open Google Analytics.
2. Create or select a GA4 property.
3. Create a Web Stream for the website.
4. Copy the Measurement ID, for example `G-XXXXXXXXXX`.

## 2. Configure Tracking

Local `.env`:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

GitHub Pages deployment:

1. Go to GitHub repository settings.
2. Open `Secrets and variables` -> `Actions` -> `Variables`.
3. Add variable `VITE_GA_MEASUREMENT_ID` with the GA4 Measurement ID.

Do not hardcode the Measurement ID in `.env.example`.

## 3. Find GA4 Property ID

The report Edge Function needs the numeric GA4 Property ID, not the `G-...` Measurement ID.

In Google Analytics:

1. Open `Admin`.
2. Select the GA4 property.
3. Copy the numeric Property ID from property details.

## 4. Create Google Cloud Service Account

1. Open Google Cloud Console.
2. Select or create a project.
3. Open `IAM & Admin` -> `Service Accounts`.
4. Create a service account, for example `ga4-report-reader`.
5. Create a JSON key.
6. Download it locally.
7. Do not commit the JSON file.

## 5. Enable Google Analytics Data API

1. In Google Cloud Console open `APIs & Services` -> `Library`.
2. Search for `Google Analytics Data API`.
3. Enable the API.

## 6. Add Service Account To GA4

1. In Google Analytics open `Admin`.
2. Select the property.
3. Open `Property access management`.
4. Add the service account email from the JSON file.
5. Grant `Viewer` or `Analyst`.

## 7. Configure Supabase Secrets

Recommended: store the full service account JSON as base64.

PowerShell:

```powershell
$json = Get-Content .\service-account.json -Raw
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json))
supabase secrets set GA4_PROPERTY_ID="123456789" GOOGLE_SERVICE_ACCOUNT_JSON_BASE64="$base64"
```

Alternative:

```powershell
supabase secrets set GA4_PROPERTY_ID="123456789" GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com" GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Never add `GOOGLE_PRIVATE_KEY` or `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` to frontend code or `VITE_*`.

## 8. Deploy Edge Function

```bash
supabase functions deploy ga4-report
```

Local function testing:

```bash
supabase functions serve ga4-report --env-file ./supabase/functions/.env.local
```

## 9. Test In Panel

1. Log in to the admin panel.
2. Open `Statystyki`.
3. Click `Odswiez`.
4. Confirm that metrics load or that the error message is actionable.

The panel dashboard reads a simplified report from Supabase Edge Function `ga4-report`. It shows:

- active users for the last 7 and 30 days,
- page views for the last 7 and 30 days,
- sessions for the last 7 and 30 days,
- event count for the last 7 and 30 days,
- top page paths,
- safe tracked events such as `cta_click`, `contact_click`, and `form_submit`,
- traffic sources by `sessionSourceMedium`,
- device categories such as desktop, mobile, and tablet.

The extra `Otworz pelny raport w Google Analytics` link may stay in the panel as a secondary action,
but the primary stats should be visible inside the CMS panel.

If the panel shows:

```text
Statystyki GA4 nie sa jeszcze skonfigurowane. Uzupelnij sekrety Edge Function i sprawdz GA4_PROPERTY_ID.
```

check:

- `GA4_PROPERTY_ID` in Supabase Edge Function Secrets,
- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` in Supabase Edge Function Secrets,
- service account access to the GA4 property,
- deployed `ga4-report` Edge Function.

If the panel shows no data, GA4 may still need time to collect traffic after tracking consent is
granted.

For a client template deployment, prefer a separate GA4 property and a separate Supabase project per
client. At minimum configure these values for every client:

- `VITE_GA_MEASUREMENT_ID` in frontend environment variables,
- `GA4_PROPERTY_ID` in Supabase Edge Function Secrets,
- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` in Supabase Edge Function Secrets,
- service account Viewer or Analyst access to the client's GA4 property.

Manual endpoint test requires a logged-in Supabase user token:

```bash
curl -X POST "https://<project-ref>.supabase.co/functions/v1/ga4-report" \
  -H "Authorization: Bearer <SUPABASE_USER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"site_id":"<VITE_SITE_ID>"}'
```

The user must be active in `site_members`. Roles `owner`, `editor`, and `viewer` may read stats.
