# Pełna notatka: przygotowanie strony z panelem CMS, Supabase i GA4 od zera

## 1. Cel konfiguracji

Celem jest przygotowanie nowoczesnej strony portfolio/ofertowej z lekkim prywatnym panelem CMS.

Panel CMS ma umożliwiać właścicielowi strony lub klientowi:

- logowanie do panelu,
- edycję podstawowych treści strony,
- edycję SEO,
- edycję danych kontaktowych,
- edycję FAQ,
- edycję oferty/usług,
- pracę na wersji roboczej,
- publikację zmian na stronie,
- podgląd podstawowych statystyk GA4 w panelu.

To nie jest pełny builder stron. Nie robimy drag-and-drop, WordPressa, uploadu mediów ani dowolnego układania layoutu. Panel ma być prosty, bezpieczny i trudny do zepsucia przez nietechnicznego klienta.

---

## 2. Ogólna architektura

Projekt składa się z kilku części:

```text
Frontend:
React + Vite + Tailwind CSS

CMS/Auth:
Supabase Auth
Supabase Database
Supabase RLS
Supabase RPC

Statystyki:
Google Analytics 4
Google Analytics Data API
Google Cloud service account
Supabase Edge Function ga4-report

Hosting:
GitHub Pages / później własna domena albo Vercel/Netlify/Cloudflare Pages
```

Najważniejsza zasada:

```text
Frontend nie może mieć sekretów.
Sekrety są tylko w Supabase Edge Function Secrets.
```

Frontend może znać:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_ID
VITE_ADMIN_HASH_PATH
VITE_GA_MEASUREMENT_ID
```

Frontend nie może znać:

```env
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
GOOGLE_PRIVATE_KEY
service-account.json
private_key
access_token
refresh_token
```

---

## 3. Przygotowanie repozytorium

W projekcie powinny istnieć najważniejsze pliki:

```text
README.md
AGENTS.md
.env.example
.gitignore
vite.config.js
src/main.jsx
src/lib/env.js
src/lib/supabaseClient.js
src/lib/contentApi.js
src/lib/analytics/ga4.js
src/admin/AdminApp.jsx
src/admin/AnalyticsPanel.jsx
src/admin/analyticsApi.js
supabase/migrations/001_core_cms.sql
supabase/functions/ga4-report/index.ts
.github/workflows/deploy.yml
scripts/check-dist-secrets.mjs
```

Przed każdą większą pracą agent powinien wykonać:

```bash
git status
```

Następnie powinien przeczytać:

```text
README.md
AGENTS.md
.env.example
```

Dopiero potem powinien zmieniać kod.

---

## 4. Plik `.gitignore`

W `.gitignore` muszą być wpisy chroniące prywatne pliki:

```gitignore
.env
.env.local
.env.*.local

service-account.json
*-service-account.json
*.service-account.json
google-service-account*.json

.DS_Store
node_modules
dist
```

Plik JSON z Google Cloud nigdy nie może trafić do repozytorium.

---

## 5. Plik `.env.example`

`.env.example` powinien zawierać tylko placeholdery:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_ID=00000000-0000-0000-0000-000000000001
VITE_ADMIN_HASH_PATH=panel-admin
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_BASE_PATH=/Dominik_Sadzik/
```

Nie wolno wpisywać tu prawdziwych sekretów.

---

## 6. Lokalny plik `.env`

Lokalnie tworzysz plik `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_SITE_ID=00000000-0000-0000-0000-000000000001
VITE_ADMIN_HASH_PATH=panel-admin
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_BASE_PATH=/Dominik_Sadzik/
```

Po każdej zmianie `.env` trzeba zatrzymać i ponownie uruchomić dev server:

```bash
Ctrl+C
npm run dev
```

---

# CZĘŚĆ A — SUPABASE CMS

## 7. Utworzenie projektu Supabase

W Supabase trzeba utworzyć nowy projekt.

Dla własnej strony może to być jeden projekt Supabase.

Dla klientów najbezpieczniej na start przyjąć zasadę:

```text
1 klient = 1 projekt Supabase
```

To ułatwia separację danych, dostępów i rozliczeń.

Po utworzeniu projektu zapisujesz:

```text
Project URL
Anon public key
Project ref
Database password
```

Do frontendu trafiają tylko:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Nie używać w froncie `service_role`.

---

## 8. Konfiguracja bazy danych Supabase

CMS opiera się na tabelach:

```text
sites
site_members
content_entries
```

Przykładowa logika:

```text
sites
- lista stron/tenantów

site_members
- użytkownicy przypisani do konkretnej strony
- role: owner, editor, viewer

content_entries
- treści strony
- osobno draft i published
```

Publiczna strona powinna czytać tylko treści `published`.

Panel admina powinien edytować `draft`.

Publikacja powinna kopiować lub oznaczać draft jako published.

---

## 9. Migracje SQL

W projekcie powinna istnieć migracja, np.:

```text
supabase/migrations/001_core_cms.sql
```

Migracja powinna tworzyć:

```text
sites
site_members
content_entries
RLS policies
RPC save_content_draft
RPC publish_content_entry
indeksy
```

Mutacje treści powinny iść przez RPC:

```text
save_content_draft
publish_content_entry
```

Frontend nie powinien robić bezpośrednio:

```sql
insert
update
upsert
delete
```

na `content_entries`.

---

## 10. Przykładowy rekord w `sites`

Dla własnej strony:

```text
id: 00000000-0000-0000-0000-000000000001
slug: dominik-sadzik
name: Dominik Sadzik
active: true
```

W `.env` musi być ten sam identyfikator:

```env
VITE_SITE_ID=00000000-0000-0000-0000-000000000001
```

Dla klienta zmieniasz:

```text
site_id
slug
name
członków strony
GA4 property
treści domyślne
domenę
```

---

## 11. RLS — bezpieczeństwo danych

RLS powinno chronić dane tak, żeby:

```text
publiczna strona mogła czytać tylko published,
admin mógł edytować tylko strony, do których należy,
viewer mógł ewentualnie tylko podglądać,
editor mógł edytować draft,
owner mógł publikować i zarządzać członkami.
```

Frontend nie może omijać RLS przez `service_role`.

`service_role` nigdy nie może trafić do frontendu.

---

## 12. Supabase Auth

Panel powinien obsługiwać:

```text
logowanie hasłem,
magic link,
reset hasła.
```

W Supabase trzeba skonfigurować adresy przekierowań.

Dla lokalnego developmentu przykładowo:

```text
http://localhost:5173/Dominik_Sadzik/?auth=callback
http://localhost:5173/Dominik_Sadzik/?auth=recovery
http://127.0.0.1:5174/Dominik_Sadzik/?auth=callback
http://127.0.0.1:5174/Dominik_Sadzik/?auth=recovery
```

Dla GitHub Pages:

```text
https://dominik-sadzik.pl/?auth=callback
https://dominik-sadzik.pl/?auth=recovery
```

Dla własnej domeny:

```text
https://twojadomena.pl/?auth=callback
https://twojadomena.pl/?auth=recovery
https://twojadomena.pl/#/panel-admin
```

---

## 13. Dodanie użytkownika do CMS

Po utworzeniu konta użytkownika w Supabase Auth trzeba dodać go do `site_members`.

Przykładowo:

```text
site_id: 00000000-0000-0000-0000-000000000001
user_id: UUID użytkownika z auth.users
role: owner
```

Bez wpisu w `site_members` użytkownik może się zalogować, ale panel powinien odmówić dostępu do edycji konkretnej strony.

---

## 14. Pierwsze uruchomienie CMS

Po skonfigurowaniu Supabase:

1. Uruchomić stronę lokalnie.
2. Wejść do panelu admina.
3. Zalogować się.
4. Sprawdzić, czy użytkownik ma rolę w `site_members`.
5. Edytować np. sekcję Hero.
6. Kliknąć zapisz draft.
7. Kliknąć publikuj.
8. Sprawdzić, czy publiczna strona pokazuje opublikowaną treść.

Jeśli strona pokazuje fallback/default content, sprawdzić:

```text
czy .env jest poprawny,
czy Vite został zrestartowany,
czy VITE_SITE_ID pasuje do sites.id,
czy content_entries ma wpis published,
czy RLS pozwala na publiczny odczyt published,
czy Supabase URL i anon key są z właściwego projektu.
```

---

# CZĘŚĆ B — GOOGLE ANALYTICS 4

## 15. Utworzenie GA4

W Google Analytics trzeba utworzyć:

```text
konto Google Analytics,
usługę/property GA4,
strumień danych Web.
```

Dla strony internetowej tworzysz Web Stream.

Z Web Stream pobierasz:

```text
Measurement ID
```

Wygląda tak:

```text
G-XXXXXXXXXX
```

Ten identyfikator trafia do frontendu:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

To służy do zbierania danych na stronie.

---

## 16. Consent dla GA4

GA4 na stronie powinno działać z consentem.

Zasady:

```text
GA4 nie powinno startować przed zgodą użytkownika,
eventy nie mogą zawierać maili,
eventy nie mogą zawierać telefonów,
eventy nie mogą zawierać imion,
eventy nie mogą zawierać treści formularzy,
page_view nie powinien wysyłać pełnych query stringów,
contact_click powinien wysyłać tylko typ/lokalizację,
form_submit powinien wysyłać tylko nazwę formularza.
```

Przykładowe bezpieczne eventy:

```text
cta_click
contact_click
form_submit
page_view
```

Nie wysyłać danych typu:

```text
adres e-mail klienta,
numer telefonu,
imię i nazwisko,
treść wiadomości,
pełny URL z tokenami,
parametry recovery/access_token.
```

---

## 17. Różnica między Measurement ID i Property ID

Są dwa różne identyfikatory GA4:

```text
G-XXXXXXXXXX
```

To jest Measurement ID. Używa go frontend do zbierania danych.

```text
123456789
```

To jest numeryczny Property ID / Identyfikator usługi. Używa go backend/API do pobierania raportów.

Do `.env` frontendu trafia:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Do Supabase Secrets trafia:

```text
GA4_PROPERTY_ID=123456789
```

---

# CZĘŚĆ C — GOOGLE CLOUD I SERVICE ACCOUNT

## 18. Po co Google Cloud

Google Analytics pokazuje statystyki w panelu Google, ale żeby własny CMS mógł pobierać dane do panelu, potrzebny jest dostęp przez API.

Do tego używa się:

```text
Google Analytics Data API
Google Cloud project
service account
klucz JSON
```

Service account to techniczne konto, którego używa Supabase Edge Function.

Nie używa go frontend.

---

## 19. Utworzenie projektu Google Cloud

W Google Cloud Console trzeba utworzyć projekt, np.:

```text
dominik-sadzik-ga4-api
```

Projekt Google Cloud nie musi być tym samym miejscem co hosting strony.

Projekt Google Cloud służy tutaj tylko do:

```text
włączenia Google Analytics Data API,
utworzenia service account,
wygenerowania klucza JSON.
```

Jeśli projekt trafi do organizacji Google Cloud, może pojawić się blokada tworzenia kluczy service account:

```text
iam.disableServiceAccountKeyCreation
```

Wtedy są opcje:

```text
utworzyć projekt bez organizacji,
albo wyłączyć tę politykę, jeśli masz odpowiednie uprawnienia,
albo dodać wyjątek dla projektu.
```

---

## 20. Włączenie Google Analytics Data API

W projekcie Google Cloud trzeba włączyć:

```text
Google Analytics Data API
```

Bez tego Supabase Edge Function może mieć dostęp do GA4, ale zapytania raportowe nadal mogą kończyć się błędem.

To był ważny krok w tym projekcie.

---

## 21. Utworzenie service account

W Google Cloud:

```text
IAM & Admin → Service Accounts → Create service account
```

Nazwa przykładowa:

```text
ga4-report
```

Po utworzeniu service account ma adres e-mail podobny do:

```text
ga4-report@twoj-projekt.iam.gserviceaccount.com
```

Ten e-mail będzie później dodawany do Google Analytics.

---

## 22. Utworzenie klucza JSON

W Google Cloud:

```text
Service Accounts → ga4-report → Keys → Add key → Create new key → JSON
```

Pobrany plik JSON jest sekretem.

Nie wolno:

```text
wrzucać go do repo,
wklejać do czatu,
dodawać do .env,
dodawać do VITE_*,
wysyłać agentowi,
trzymać na pulpicie bez potrzeby.
```

W pliku JSON znajduje się między innymi:

```text
client_email
private_key
private_key_id
```

Do rozmów i konfiguracji GA4 można używać samego `client_email`.

Nie wolno udostępniać `private_key`.

---

## 23. Dodanie service account do GA4

W Google Analytics trzeba dodać service account jako użytkownika usługi/property.

Najpierw z pliku JSON pobrać:

```json
"client_email": "ga4-report@twoj-projekt.iam.gserviceaccount.com"
```

Następnie w Google Analytics:

```text
Administracja → Zarządzanie dostępem do usługi → Dodaj użytkownika
```

Nadać rolę:

```text
Viewer
```

albo:

```text
Analyst
```

Jeśli UI Google Analytics nie pozwala dodać service account i pokazuje komunikat, że e-mail nie jest powiązany z kontem Google, można dodać dostęp przez Google Analytics Admin API, metodą `properties.accessBindings.create`.

W API Explorer:

```text
parent:
properties/NUMERYCZNE_PROPERTY_ID
```

Request body:

```json
{
  "user": "ga4-report@twoj-projekt.iam.gserviceaccount.com",
  "roles": ["predefinedRoles/viewer"]
}
```

Wynik `200` oznacza, że dostęp został dodany.

Po tym warto wrócić do GA4 i sprawdzić, czy service account jest widoczny na liście użytkowników usługi.

---

# CZĘŚĆ D — SUPABASE EDGE FUNCTION DLA GA4

## 24. Po co Edge Function

Frontend nie może sam używać Google service account, bo wtedy prywatny klucz byłby widoczny w przeglądarce.

Dlatego działa to tak:

```text
CMS frontend → Supabase Edge Function ga4-report → Google Analytics Data API → wynik do CMS
```

Sekrety są tylko w Supabase.

---

## 25. Wymagane sekrety Supabase Edge Function

W Supabase trzeba ustawić:

```text
GA4_PROPERTY_ID
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
```

`GA4_PROPERTY_ID` to numeryczny identyfikator usługi GA4, np.:

```text
123456789
```

`GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` to zawartość pliku service account JSON zamieniona na base64.

Nie wpisywać tutaj `G-XXXXXXXXXX`.

---

## 26. Zamiana JSON na base64

Jeśli plik JSON jest w Windows, można użyć PowerShella.

Przykład dla pliku w konkretnym folderze:

```powershell
$path = "D:\private\project-keys\ga4-service-account.json"
[Convert]::ToBase64String([IO.File]::ReadAllBytes($path)) | Set-Clipboard
```

To kopiuje base64 do schowka.

Nie wklejać base64 do czatu.

---

## 27. Ustawienie sekretów Supabase CLI

W folderze projektu:

```bash
npx supabase login
```

Jeśli projekt nie jest jeszcze połączony:

```bash
npx supabase link --project-ref TWOJ_PROJECT_REF
```

Sprawdzenie project ref:

```bash
cat supabase/.temp/project-ref
```

Powinien zgadzać się z adresem Supabase używanym przez frontend:

```text
https://TWOJ_PROJECT_REF.supabase.co
```

Ustawienie sekretów:

```bash
npx supabase secrets set GA4_PROPERTY_ID="123456789"
```

```bash
npx supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON_BASE64="WKLEJ_BASE64_ZE_SCHOWKA"
```

Sprawdzenie, czy sekrety istnieją:

```bash
npx supabase secrets list
```

Lista sekretów nie powinna pokazywać ich wartości.

---

## 28. Deploy Edge Function

Po ustawieniu sekretów wdrażasz funkcję:

```bash
npx supabase functions deploy ga4-report
```

Deploy GitHub Pages nie wdraża Supabase Edge Function.

Jeśli zmieniasz kod w:

```text
supabase/functions/ga4-report/index.ts
```

trzeba ponownie wykonać:

```bash
npx supabase functions deploy ga4-report
```

---

## 29. Test działania GA4 w CMS

Po deployu:

1. Wejść na stronę.
2. Zalogować się do CMS.
3. Otworzyć zakładkę Statystyki.
4. Kliknąć Odśwież dane.
5. Sprawdzić, czy pojawiają się:
   - odwiedzający,
   - odsłony,
   - wizyty,
   - akcje,
   - najczęściej odwiedzane strony,
   - źródła ruchu,
   - urządzenia.

Jeśli pojawia się błąd, w DevTools sprawdzić request:

```text
/functions/v1/ga4-report
```

Najważniejsze statusy:

```text
403
- brak dostępu,
- zły GA4_PROPERTY_ID,
- service account nie ma dostępu do property,
- Google Analytics Data API nie jest włączone.

503
- funkcja nie działa poprawnie,
- problem z konfiguracją,
- błąd po stronie Edge Function.

401
- użytkownik nie jest zalogowany,
- brak sesji,
- brak tokenu.

200
- funkcja działa.
```

Przykład błędu:

```json
{
  "error": {
    "code": "ga4_access_denied",
    "message": "Service account nie ma dostepu do GA4 property."
  }
}
```

Przy tym błędzie sprawdzić:

```text
czy service account jest na liście użytkowników GA4,
czy mail z JSON-a zgadza się z mailem w GA4,
czy GA4_PROPERTY_ID jest numerycznym identyfikatorem usługi,
czy Google Analytics Data API jest włączone,
czy sekrety są ustawione w tym samym projekcie Supabase, którego używa strona.
```

---

# CZĘŚĆ E — HOSTING I DEPLOY FRONTENDU

## 30. GitHub Pages

Na start projekt może działać na GitHub Pages.

Dla repozytorium projektowego Vite zwykle ma base:

```js
base: "/Dominik_Sadzik/";
```

Lepsze rozwiązanie pod przyszłe przenoszenie:

```js
base: process.env.VITE_BASE_PATH || "/Dominik_Sadzik/";
```

Dla GitHub Pages:

```env
VITE_BASE_PATH=/Dominik_Sadzik/
```

Dla własnej domeny:

```env
VITE_BASE_PATH=/
```

---

## 31. GitHub Actions Variables

W GitHub trzeba ustawić publiczne zmienne builda:

```text
Settings → Secrets and variables → Actions → Variables
```

Dodać:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_ID
VITE_ADMIN_HASH_PATH
VITE_GA_MEASUREMENT_ID
VITE_BASE_PATH
```

Do GitHub Variables nie dodawać:

```text
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
SUPABASE_SERVICE_ROLE_KEY
service-account.json
GOOGLE_PRIVATE_KEY
```

---

## 32. Deploy strony vs deploy funkcji

Są dwa osobne deploye:

```text
Frontend:
GitHub Pages / Vercel / Netlify / Cloudflare Pages

Backend GA4 report:
Supabase Edge Function
```

Deploy frontendu nie wdraża Edge Function.

Po zmianie kodu strony:

```bash
git push
```

Po zmianie Edge Function:

```bash
npx supabase functions deploy ga4-report
```

---

# CZĘŚĆ F — CUSTOM DOMAIN

## 33. Migracja na własną domenę

Przy migracji z GitHub Pages na własną domenę zmienia się głównie:

```text
DNS domeny,
ustawienia hostingu,
VITE_BASE_PATH,
Supabase Auth Redirect URLs,
GA4 Web Stream URL,
GitHub Actions Variables / hosting env variables.
```

Supabase CMS może zostać ten sam:

```text
VITE_SUPABASE_URL bez zmian,
VITE_SUPABASE_ANON_KEY bez zmian,
VITE_SITE_ID bez zmian,
site_members bez zmian,
content_entries bez zmian.
```

Dla własnej domeny:

```env
VITE_BASE_PATH=/
```

W Supabase Auth dodać redirect URLs:

```text
https://twojadomena.pl/?auth=callback
https://twojadomena.pl/?auth=recovery
https://twojadomena.pl/#/panel-admin
```

W GA4 warto zmienić adres strumienia Web na docelową domenę.

---

# CZĘŚĆ G — CHECKLISTA DLA NOWEGO KLIENTA

## 34. Co kopiujemy z template’u

Dla nowego klienta można skopiować:

```text
kod frontendu,
panel CMS,
formularze edycji treści,
strukturę Supabase migrations,
Edge Function ga4-report,
dokumentację,
workflow deployu.
```

Nie kopiować sekretów.

---

## 35. Co trzeba zmienić dla klienta

Dla każdego klienta zmienić:

```text
VITE_SITE_ID
nazwa strony w sites
slug strony
treści domyślne
dane kontaktowe
SEO
logo/kolory/branding
domena
GA4 Measurement ID
GA4 Property ID
service account / dostęp GA4
Supabase project albo tenant
członkowie site_members
redirect URLs
```

Najbezpieczniejszy model na start:

```text
osobny Supabase project dla klienta,
osobna GA4 property dla klienta,
osobny service account lub osobny dostęp do property,
osobne env variables hostingu.
```

---

## 36. Minimalna konfiguracja klienta — skrót

Dla nowego klienta:

1. Utworzyć projekt Supabase.
2. Uruchomić migracje SQL.
3. Dodać rekord w `sites`.
4. Dodać użytkownika klienta do Auth.
5. Dodać użytkownika do `site_members`.
6. Ustawić lokalne `.env`.
7. Ustawić env variables na hostingu.
8. Utworzyć GA4 property i Web Stream.
9. Dodać `VITE_GA_MEASUREMENT_ID`.
10. Utworzyć Google Cloud project.
11. Włączyć Google Analytics Data API.
12. Utworzyć service account.
13. Pobrać JSON.
14. Dodać service account do GA4 property.
15. Zamienić JSON na base64.
16. Ustawić Supabase secrets:
    - `GA4_PROPERTY_ID`
    - `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`

17. Wdrożyć Edge Function:
    - `supabase functions deploy ga4-report`

18. Sprawdzić panel CMS.
19. Sprawdzić publikację treści.
20. Sprawdzić statystyki GA4 w panelu.

---

# CZĘŚĆ H — BEZPIECZEŃSTWO

## 37. Czego nigdy nie robić

Nie commitować:

```text
.env
service-account.json
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
SUPABASE_SERVICE_ROLE_KEY
private_key
access_token
refresh_token
```

Nie wklejać do chatu:

```text
całego service-account.json,
base64 z JSON-a,
private_key,
tokenów auth,
service_role key.
```

Można pokazywać:

```text
client_email service account,
project ref Supabase,
publiczny Supabase URL,
anon public key,
Measurement ID G-...,
numeryczny Property ID, jeśli nie przeszkadza biznesowo.
```

Mimo że część z tych danych nie jest sekretem, nadal lepiej nie publikować ich bez potrzeby.

---

## 38. Co zrobić z plikiem JSON po konfiguracji

Po dodaniu sekretu do Supabase:

```text
najlepiej usunąć plik JSON z komputera,
albo trzymać go poza repo w prywatnym folderze,
albo przechowywać w menedżerze haseł / bezpiecznym magazynie.
```

Nie trzymać na pulpicie ani w Downloads.

Przykładowy folder lokalny:

```text
D:\private\project-keys\
```

Jeśli plik zostanie zgubiony, nie da się pobrać tego samego klucza ponownie. Można utworzyć nowy klucz JSON dla tego samego service account i zaktualizować sekret w Supabase.

Jeśli istnieje podejrzenie wycieku, stary klucz trzeba usunąć w Google Cloud.

---

# CZĘŚĆ I — KOMENDY KONTROLNE

## 39. Komendy po zmianach w kodzie

Po większych zmianach:

```bash
npm run format:check
npm test
npm run build
```

Jeśli `format:check` nie istnieje, trzeba dodać go do `package.json` albo dostosować `AGENTS.md`.

Przykład:

```json
{
  "scripts": {
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

---

## 40. Komendy Supabase

Logowanie:

```bash
npx supabase login
```

Połączenie z projektem:

```bash
npx supabase link --project-ref TWOJ_PROJECT_REF
```

Sprawdzenie project ref:

```bash
cat supabase/.temp/project-ref
```

Ustawienie sekretów:

```bash
npx supabase secrets set GA4_PROPERTY_ID="123456789"
```

```bash
npx supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON_BASE64="WKLEJ_BASE64"
```

Lista sekretów:

```bash
npx supabase secrets list
```

Deploy funkcji:

```bash
npx supabase functions deploy ga4-report
```

---

# CZĘŚĆ J — TYPOWE PROBLEMY

## 41. CMS pokazuje fallback/default content

Sprawdzić:

```text
.env,
restart Vite,
VITE_SITE_ID,
czy sites ma rekord,
czy content_entries ma published,
czy RLS pozwala na odczyt,
czy Supabase URL jest poprawny.
```

---

## 42. Logowanie działa, ale panel nie pokazuje danych

Sprawdzić:

```text
czy użytkownik istnieje w Supabase Auth,
czy ma wpis w site_members,
czy rola jest poprawna,
czy site_id się zgadza,
czy RLS nie blokuje.
```

---

## 43. Reset hasła nie działa

Sprawdzić:

```text
Supabase Auth Redirect URLs,
czy link recovery prowadzi na właściwą domenę,
czy aplikacja obsługuje ?auth=recovery,
czy updateUser({ password }) jest wywoływany po odzyskaniu sesji,
czy tokeny nie są logowane w konsoli.
```

---

## 44. GA4 nie pokazuje danych w CMS

Sprawdzić:

```text
czy GA4 zbiera dane,
czy użytkownik wyraził zgodę na analytics,
czy VITE_GA_MEASUREMENT_ID jest poprawny,
czy Google Analytics Data API jest włączone,
czy service account jest dodany do GA4 property,
czy GA4_PROPERTY_ID to numer usługi, a nie G-...,
czy GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 pochodzi z właściwego JSON-a,
czy Supabase secrets są ustawione w dobrym projekcie,
czy ga4-report został wdrożony,
czy request /functions/v1/ga4-report zwraca 200.
```

---

## 45. Błąd `ga4_access_denied`

Sprawdzić:

```text
czy service account jest widoczny w GA4 access management,
czy mail z JSON-a zgadza się z mailem w GA4,
czy API Explorer dodał dostęp do właściwego properties/PROPERTY_ID,
czy GA4_PROPERTY_ID w Supabase jest ten sam,
czy Google Analytics Data API jest włączone,
czy funkcja została ponownie wdrożona po zmianach.
```

---

## 46. Błąd `Failed to send a request to the Edge Function`

Sprawdzić:

```text
czy funkcja ga4-report jest wdrożona,
czy frontend używa dobrego Supabase URL,
czy Supabase project ref się zgadza,
czy funkcja nie zwraca błędu 500,
czy użytkownik jest zalogowany,
czy nie ma problemów CORS/auth.
```

---

# CZĘŚĆ K — FINALNA CHECKLISTA WDROŻENIA

## 47. Przed oddaniem strony

Sprawdzić:

```text
strona publiczna działa,
CMS działa,
logowanie działa,
magic link działa,
reset hasła działa,
edycja draft działa,
publikacja działa,
SEO można edytować,
kontakt można edytować,
FAQ można edytować,
ofertę/usługi można edytować,
GA4 zbiera dane po zgodzie,
panel pokazuje statystyki,
brak sekretów w repo,
build przechodzi,
testy przechodzą,
mobile nie ma overflow,
sekcja kontaktu nie jest ucięta,
panel nie ma blank screenów,
ErrorBoundary działa,
GitHub Pages / hosting działa,
redirect URLs są poprawne.
```

---

## 48. Co zapisać w dokumentacji klienta

Dla klienta warto przygotować krótką instrukcję:

```text
jak zalogować się do panelu,
jak zmienić treść,
jak zapisać draft,
jak opublikować zmiany,
jak sprawdzić statystyki,
co oznaczają odwiedzający/odsłony/wizyty/akcje,
czego klient nie może edytować samodzielnie,
gdzie zgłosić większe zmiany layoutu.
```

Panel sprzedawać jako:

```text
Nowoczesna strona z bezpiecznym panelem do edycji najważniejszych treści i podglądu statystyk.
```

Nie sprzedawać jako:

```text
pełny builder,
WordPress,
system do dowolnego przebudowywania strony.
```

---

# Podsumowanie

Aby taki panel CMS działał od zera, trzeba przygotować:

```text
1. Frontend React/Vite.
2. Supabase Auth.
3. Supabase Database.
4. RLS.
5. RPC do draft/publish.
6. Członków strony w site_members.
7. GA4 Web Stream do zbierania danych.
8. Consent dla analytics.
9. Google Cloud project.
10. Google Analytics Data API.
11. Service account.
12. Dostęp service account do GA4 property.
13. Supabase Edge Function ga4-report.
14. Supabase Secrets dla GA4.
15. Deploy frontendu.
16. Deploy Edge Function.
17. Test CMS i statystyk.
```

Najważniejsze zasady:

```text
Frontend ma tylko publiczne VITE_*.
Sekrety są tylko w Supabase Secrets.
Publiczna strona czyta tylko published.
Panel edytuje draft.
Publikacja idzie przez RPC.
GA4 raporty idą przez Edge Function.
Nie commitować sekretów.
Nie robić z panelu pełnego buildera.
```
