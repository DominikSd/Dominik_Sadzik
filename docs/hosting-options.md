# Hosting Options

Ten projekt rozdziela frontend od backendu CMS. Frontend może działać na dowolnym hostingu statycznym,
a CMS korzysta z Supabase niezależnie od wybranego hostingu frontendu.

## Rekomendacja

- GitHub Pages zostaje dobrym wyborem dla portfolio, demo i projektów testowych.
- Dla płatnych stron klientów rekomendowane są Netlify, Vercel, Cloudflare Pages albo płatny hosting
  uzgodniony z klientem.
- Supabase CMS działa niezależnie od hostingu frontendu, o ile ustawione są poprawne `VITE_*`,
  redirect URLs w Supabase Auth i CORS/URL-e używane przez aplikację.

## GitHub Pages

Najlepsze dla:

- portfolio,
- demo,
- stron bez większych wymagań SLA,
- prostego hostingu publicznego z GitHub Actions.

Plusy:

- brak dodatkowego panelu hostingowego,
- prosty deploy z repo,
- dobre do pokazania klientowi wersji demo,
- niski koszt wejścia.

Minusy:

- mniej wygodna obsługa domen, przekierowań i preview deployów niż w platformach komercyjnych,
- statyczny hosting bez funkcji serverless,
- repo path wymaga poprawnego `base` w Vite, np. `/Dominik_Sadzik/`,
- słabsze dopasowanie do płatnej obsługi wielu klientów.

Wniosek:

GitHub Pages jest dobry dla własnego portfolio i demo. Dla płatnej strony klienta używaj go tylko
wtedy, gdy klient akceptuje ograniczenia i model utrzymania.

## Netlify

Najlepsze dla:

- małych i średnich stron klientów,
- szybkich landing page'y,
- stron z domeną klienta,
- prostego procesu preview/deploy.

Plusy:

- wygodne domeny i SSL,
- preview deploye,
- czytelne environment variables,
- prosta integracja z GitHubem,
- możliwość dodania formularzy lub funkcji Netlify w przyszłości, jeśli projekt tego wymaga.

Minusy:

- część funkcji może wymagać płatnego planu,
- trzeba pilnować właściciela konta i dostępu klienta,
- dodatkowy panel do utrzymania.

Wniosek:

Netlify jest bardzo dobrym domyślnym wyborem dla płatnych stron klientów, jeśli projekt pozostaje
statycznym frontendem z Supabase jako backendem.

## Vercel

Najlepsze dla:

- projektów React/Next.js,
- zespołów przyzwyczajonych do preview deployów,
- stron, które mogą w przyszłości przejść na Next.js albo serverless.

Plusy:

- bardzo wygodne preview deploye,
- dobra integracja z GitHubem,
- czytelne environment variables,
- wygodna obsługa domen i SSL,
- dobra ścieżka rozwoju, jeśli projekt klienta urośnie.

Minusy:

- dla czystego Vite/SPA może być bardziej rozbudowany niż potrzeba,
- limity i funkcje zależą od planu,
- trzeba pilnować właściciela konta i rozliczeń.

Wniosek:

Vercel jest dobrym wyborem, jeśli chcesz mieć profesjonalny workflow wdrożeniowy albo planujesz
łatwe przejście do bardziej rozbudowanego stacku.

## Cloudflare Pages

Najlepsze dla:

- szybkich statycznych stron,
- klientów z domenami na Cloudflare,
- projektów, które korzystają z globalnego CDN i prostego DNS.

Plusy:

- bardzo dobry CDN,
- wygodne domeny, DNS i SSL, jeśli domena jest w Cloudflare,
- preview deploye,
- sensowny koszt dla statycznych stron,
- Workers mogą być opcją rozwoju, jeśli projekt tego wymaga.

Minusy:

- panel i model konfiguracji mogą być mniej oczywiste dla nietechnicznego klienta,
- trzeba jasno ustalić dostęp do konta Cloudflare,
- dodatkowa warstwa do utrzymania, jeśli klient nie używa Cloudflare.

Wniosek:

Cloudflare Pages jest dobrym wyborem, gdy domena klienta i DNS są już w Cloudflare albo chcesz mieć
mocny hosting statyczny z globalnym CDN.

## Supabase A Hosting Frontendu

Supabase odpowiada za:

- Auth,
- tabele CMS,
- RLS,
- RPC,
- Edge Function `ga4-report`,
- sekrety GA4 po stronie backendu.

Hosting frontendu odpowiada za:

- zbudowanie aplikacji,
- serwowanie statycznych plików,
- publiczne zmienne `VITE_*`,
- domenę i SSL,
- deploy.

W praktyce możesz hostować frontend na GitHub Pages, Netlify, Vercel albo Cloudflare Pages, a ten
sam Supabase CMS będzie działał tak samo, jeśli:

- `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY` są poprawne,
- `VITE_SITE_ID` wskazuje właściwy rekord w `sites`,
- `VITE_ADMIN_HASH_PATH` pasuje do panelu,
- redirect URLs w Supabase Auth zawierają dokładny origin i ścieżkę produkcyjną,
- GA4 i Edge Function mają poprawne sekrety.

## Decyzja Dla Klienta

Przy wyborze hostingu ustal:

- kto jest właścicielem konta hostingowego,
- kto płaci faktury,
- kto ma dostęp administracyjny,
- czy klient potrzebuje preview deployów,
- czy domena jest już kupiona,
- kto zarządza DNS,
- czy wymagany jest płatny plan,
- jak wygląda zakończenie współpracy i przekazanie dostępu.
