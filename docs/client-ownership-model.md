# Client Ownership Model

Przed wdrożeniem strony klienta ustal model własności i odpowiedzialności. Technicznie ten projekt
może działać w każdym z trzech modeli: klient posiada wszystko, Ty zarządzasz wszystkim, albo
odpowiedzialność jest podzielona.

## Model 1: Klient Ma Własne Konta I Domenę

W tym modelu klient jest właścicielem:

- domeny,
- hostingu,
- repozytorium albo organizacji GitHub,
- projektu Supabase,
- konta Google Analytics,
- konta Google Cloud/service account dla GA4 Data API.

Twoja rola:

- konfigurujesz projekt,
- wdrażasz stronę,
- dokumentujesz dostęp,
- możesz mieć dostęp administracyjny albo developerski,
- po zakończeniu współpracy klient zachowuje pełną kontrolę.

Plusy:

- klient ma pełną własność,
- łatwiejsze zakończenie współpracy,
- przejrzyste faktury i odpowiedzialność,
- mniejsze ryzyko zależności od Twoich kont.

Minusy:

- więcej pracy przy onboardingu,
- klient musi umieć zarządzać dostępami albo zaakceptować instrukcje,
- trudniej utrzymać spójny standard na wielu projektach.

Najlepsze dla:

- większych klientów,
- firm wymagających własności zasobów,
- projektów z formalnymi wymaganiami bezpieczeństwa.

## Model 2: Ty Zarządzasz Wszystkim, Klient Płaci Abonament

W tym modelu Ty kontrolujesz:

- hosting,
- wdrożenia,
- Supabase,
- konfigurację GA4,
- aktualizacje,
- backupy,
- monitoring podstawowego działania.

Klient otrzymuje:

- adres strony,
- konto do panelu CMS,
- zakres miesięcznej obsługi,
- raport lub podsumowanie zmian, jeśli jest w umowie.

Plusy:

- prostsze doświadczenie dla klienta,
- łatwiejszy stały standard techniczny,
- możliwość sprzedaży abonamentu,
- mniejszy chaos z dostępami.

Minusy:

- większa odpowiedzialność po Twojej stronie,
- trzeba pilnować faktur, limitów i dostępności,
- klient jest zależny od Twojej obsługi,
- trzeba jasno opisać przekazanie projektu po zakończeniu umowy.

Najlepsze dla:

- małych firm,
- klientów nietechnicznych,
- stron wizytówkowych i ofertowych z opieką miesięczną.

## Model 3: Hybrydowy

W tym modelu część zasobów należy do klienta, a częścią zarządzasz Ty.

Typowy wariant:

- domena należy do klienta,
- GA4 należy do klienta,
- hosting i repo obsługujesz Ty,
- Supabase może być klienta albo Twój, zależnie od umowy,
- klient ma konto `owner` albo `editor` w panelu CMS.

Plusy:

- klient ma kontrolę nad kluczowymi aktywami,
- Ty utrzymujesz techniczny standard,
- łatwiej dopasować model do budżetu i kompetencji klienta.

Minusy:

- wymaga dokładnego spisania odpowiedzialności,
- łatwo o niejasność, kto ma reagować na awarie,
- trzeba pilnować dostępów przy zmianie umowy.

Najlepsze dla:

- klientów, którzy mają domenę i GA4, ale nie chcą technicznie utrzymywać strony,
- projektów z abonamentem, ale z własnością kluczowych aktywów po stronie klienta.

## Minimalne Ustalenia W Umowie

Ustal na piśmie:

- kto jest właścicielem domeny,
- kto ma dostęp do DNS,
- kto jest właścicielem repo,
- kto jest właścicielem projektu Supabase,
- kto ma dostęp do Supabase Auth i bazy,
- kto ma dostęp do GA4,
- kto ma dostęp do Google Cloud/service account,
- kto płaci za hosting,
- kto płaci za Supabase,
- kto płaci za domenę,
- kto odpowiada za backup,
- kto odpowiada za aktualizacje,
- jaki jest czas reakcji na awarie,
- jak wygląda przekazanie projektu po zakończeniu współpracy.

## Checklist Własności I Odpowiedzialności

Przed startem projektu wypełnij:

```text
Klient:
Projekt:
Data:

Domena:
- właściciel:
- rejestrator:
- dostęp DNS:
- termin odnowienia:
- kto płaci:

Hosting frontendu:
- platforma:
- właściciel konta:
- administratorzy:
- kto płaci:
- plan:

Repozytorium:
- właściciel:
- administratorzy:
- zasady branch/deploy:

Supabase:
- właściciel projektu:
- administratorzy:
- kto płaci:
- backup:
- kto zarządza Auth:

GA4:
- właściciel property:
- administratorzy:
- Measurement ID:
- Property ID:

Google Cloud / service account:
- właściciel:
- kto ma dostęp:
- gdzie są trzymane sekrety:

Panel CMS:
- owner:
- editorzy:
- viewerzy:
- ścieżka panelu:

Utrzymanie:
- kto odpowiada za aktualizacje:
- kto odpowiada za backup:
- zakres abonamentu:
- czas reakcji:
- sposób zgłaszania zmian:
```

## Rekomendacja Praktyczna

Dla małych płatnych stron najczęściej najlepiej działa model hybrydowy:

- klient posiada domenę i GA4,
- Ty zarządzasz hostingiem, deployem i techniczną opieką,
- Supabase jest ustalony zależnie od abonamentu,
- wszystkie dostępy są opisane przed startem produkcyjnym.

Najważniejsze: klient musi wiedzieć, za co płaci, co posiada i co stanie się z projektem po
zakończeniu współpracy.
