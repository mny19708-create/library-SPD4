# Leafline University Library

Responsive Vue app for study-room booking, library search, loans, and learning rewards.

## Run locally

```sh
npm install
npm run dev
```

The app uses sample data when `VITE_API_BASE_URL` is not set. Copy `.env.example` to `.env` and point it at the library API to enable live room and book requests.

## MySQL schema

`database/schema.sql` creates the MySQL 8.0.16+ schema for users, rooms, bookings, books, book reservations, borrow logs, point transactions, and certificates. Run it with a MySQL client to create the `leafline_library` database. The frontend still needs a backend API to read and write these tables.

For room QR check-in, generate a new cryptographically random token in the backend, store only its SHA-256 hash in `bookings.qr_token_hash`, and set `qr_expires_at`. Set book reservation `expires_at` to 24 hours after `reserved_at`; a backend job should expire holds and release stock. Enforce room schedule conflicts and stock changes in database transactions.

## API integration

- `POST /auth/register` accepts `full_name`, `student_id`, `email`, `faculty`, `year`, `phone`, and `password`; return an authentication `token` on success.
- `GET /rooms` returns room IDs, names, floors, capacities, and availability.
- `POST /rooms/book` accepts `{ "room_id": "2A" }` and may return a `qr_code`.
- `POST /rooms/check-in` accepts `{ "room_id": "2A", "verification_code": "..." }`.
- `GET /books` and `GET /books/search?q=...` return inventory and catalog records.
- `POST /books/hold` accepts `{ "book_id": "..." }`.
- `POST /loans/renew` and `POST /loans/return` accept `{ "loan_id": "..." }`.

Without `VITE_API_BASE_URL`, registration creates a demo profile in this browser only; the password is never stored. Real account creation and authentication require the `/auth/register` backend endpoint. The 15-minute room countdown, 24-hour book holds, sample loan records, and estimated daily late fees are also demonstrated locally. Production-wide booking release, QR validation, reminders, fines, rewards, and live analytics require a backend with persistent storage and scheduled jobs; browser storage alone cannot provide those guarantees.