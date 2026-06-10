# Supabase RLS Manual Test

Te testy wymagają prawdziwego projektu Supabase, użytkowników Auth i wpisów w `site_members`.

## Odczyt

## Role

Te testy wymagają prawdziwego projektu Supabase, użytkowników Auth i wpisów w `site_members`.

- `viewer` nie może publikowac.

## Odczyt

- `owner` może zapisac draft przez RPC `save_content_draft`.
- Anon nie może czytać draftów z `content_entries`.
- Publiczna strona widzi tylko rekordy `published`.
- Draft nie pojawia się publicznie przed publikacją.
- Użytkownik spoza `site_members` nie widzi panelu dla danego `site_id`.
- Członkowie site A nie mogą czytać draftów site B.
- `editor` może zapisac draft przez RPC `save_content_draft`.

## Role

- `owner` i `editor` mogą publikowac przez RPC `publish_content_entry`.
- `viewer` może wejść do panelu, ale nie może zapisać draftu.

## Mutacje

- Frontend nie wykonuje `insert`, `update`, `upsert` ani `delete` na `content_entries`.
- Zapis tresci idzie tylko przez RPC `save_content_draft`.
- Publikacja idzie tylko przez RPC `publish_content_entry`.
- Klient nie może bezposrednio ustawic `created_by`, `updated_by`, `published_by` ani `published_at`.

## Publikacja

- `publish_content_entry` archiwizuje poprzedni `published`.
- `publish_content_entry` tworzy nowy `published` na podstawie draftu.
- Po publikacji draft zostaje robocza kopia ostatnio opublikowanej wersji.
