# Leafline University Library

Responsive online library app for searching catalogs, reading public-domain ebooks, and saving a personal reading history.

## Run locally

```sh
npm install
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
npm run dev
```

Set the PostgreSQL/Supabase connection values, a random `JWT_SECRET`, and `ADMIN_USERNAME` in `backend/.env`. Run `npm run admin:password` in an interactive terminal to set an Admin password; input is hidden and the script stores only a bcrypt hash in the ignored `backend/.env` file. Do not copy real credentials into `.env.example`. The `.env` files are local-only and must not be committed. The single `npm run dev` command starts the Vue app and API; Vite forwards `/api` requests to Express. Set `VITE_API_BASE_URL=local` in `.env` only when intentionally using the browser-only demo mode.

Open `http://localhost:5173/admin` or use “ចូលផ្នែកអ្នកគ្រប់គ្រង” on the sign-in screen. Admin access uses the configured username and bcrypt password hash and can manage catalog books. Admin credentials are not the same as student credentials.

The backend uses the existing books table where available, creates the student-account and reading-list tables automatically, and exposes `/api/auth/register`, `/api/auth/login`, `/api/books`, `/api/books/search`, and `/api/reading-list`. Reading history is associated with the signed-in student and PostgreSQL; browser storage is retained as a local cache.

The online catalog also searches Project Gutenberg through Gutendex and Open Library.

## MySQL schema

`database/schema.sql` remains the separate MySQL 8.0.16+ schema for the institution's room and physical-loan system. The integrated Vue app backend uses PostgreSQL/Supabase and `backend/schema.sql`; do not run the MySQL schema against PostgreSQL.
