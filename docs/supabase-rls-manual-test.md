# Supabase RLS Manual Test

Te testy wymagaja prawdziwego projektu Supabase, uzytkownikow Auth i wpisow w `site_members`.

## Odczyt

- Anon nie moze czytac draftow z `content_entries`.
- Publiczna strona widzi tylko rekordy `published`.
- Draft nie pojawia sie publicznie przed publikacja.
- Uzytkownik spoza `site_members` nie widzi panelu dla danego `site_id`.
- Czlonkowie site A nie moga czytac draftow site B.

## Role

- `viewer` moze wejsc do panelu, ale nie moze zapisac draftu.
- `viewer` nie moze publikowac.
- `owner` moze zapisac draft przez RPC `save_content_draft`.
- `editor` moze zapisac draft przez RPC `save_content_draft`.
- `owner` i `editor` moga publikowac przez RPC `publish_content_entry`.

## Mutacje

- Frontend nie wykonuje `insert`, `update`, `upsert` ani `delete` na `content_entries`.
- Zapis tresci idzie tylko przez RPC `save_content_draft`.
- Publikacja idzie tylko przez RPC `publish_content_entry`.
- Klient nie moze bezposrednio ustawic `created_by`, `updated_by`, `published_by` ani `published_at`.

## Publikacja

- `publish_content_entry` archiwizuje poprzedni `published`.
- `publish_content_entry` tworzy nowy `published` na podstawie draftu.
- Po publikacji draft zostaje robocza kopia ostatnio opublikowanej wersji.
