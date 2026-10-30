# Leafline University Library

Responsive online library app for searching catalogs, reading public-domain ebooks, and saving a personal reading history.

## Run locally

```sh
npm install
npm run dev
```

The online catalog works without a configured library API by searching Project Gutenberg through Gutendex and Open Library. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to include the institution's own catalog.

## MySQL schema

`database/schema.sql` creates the MySQL 8.0.16+ schema for users, rooms, bookings, books, book reservations, borrow logs, point transactions, and certificates. Run it with a MySQL client to create the `leafline_library` database. The frontend still needs a backend API to read and write these tables.

The existing SQL schema still contains the institution's room and physical-loan tables; these services are not exposed in the current online-reading app.

## API integration

- `POST /auth/register` accepts `full_name`, `student_id`, `email`, `faculty`, `year`, `phone`, and `password`; return an authentication `token` on success.
- `POST /auth/login` accepts `email` and `password`; return an authentication `token` and a `user` profile (`full_name`, `student_id`, `email`, `faculty`, `year`, `phone`, and optional `avatar`).
- `GET /books` and `GET /books/search?q=...` return inventory and catalog records. Include `digital_url` for an authorized PDF/reader URL and/or `digital_content` for licensed plain-text content; the app displays these in its in-app reader.
- Online searches query both Project Gutenberg and Open Library. Public-domain Gutenberg text and available Open Library scans open in the in-app reader; institution-provided text content is shown in a paginated reader. Borrow-only or metadata-only records link to their source.
- The personal read list is stored in browser local storage.

Without `VITE_API_BASE_URL`, registration creates a demo account in this browser only. A PBKDF2 password verifier is saved locally, not the original password. Real account creation and authentication require the `/auth/register` and `/auth/login` backend endpoints.