# Local CMS Test

Ta checklista sprawdza podstawowy przeplyw draft/published bez AI, Storage i buildera.

1. Skopiuj `.env.example` do `.env`.
2. Uzupelnij lokalne wartosci `VITE_*`.
3. Uruchom `npm run dev`.
4. Wejdz na `http://localhost:5173/#/panel-admin`.
5. Zaloguj sie uzytkownikiem z Supabase Auth.
   - Jeśli nie pamiętasz hasła, użyj opcji `Reset hasła`, aby wysłać link resetujący.
6. Upewnij sie, ze ten uzytkownik jest aktywny w `site_members` dla `VITE_SITE_ID`.
7. Zmien tekst w sekcji Hero.
8. Kliknij `Zapisz draft`.
9. Otworz publiczna strone i sprawdz, ze jeszcze nie pokazuje zmiany.
10. Wroc do panelu i kliknij `Opublikuj`.
11. Odswiez publiczna strone i sprawdz, ze pokazuje opublikowana zmiane.

Jesli panel pokazuje komunikat o braku konfiguracji CMS, sprawdz `.env` i zrestartuj `npm run dev`.
