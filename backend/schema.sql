CREATE TABLE IF NOT EXISTS app_students (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  student_id VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  faculty VARCHAR(120) NOT NULL,
  study_year VARCHAR(20) NOT NULL,
  phone VARCHAR(30),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL DEFAULT 'Unknown author',
  category VARCHAR(120),
  drive_link TEXT,
  cover_image TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_reading_list (
  user_id BIGINT NOT NULL REFERENCES app_students (id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(500) NOT NULL DEFAULT 'Unknown author',
  cover_url TEXT,
  online_url TEXT,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_books_title_author ON books (title, author);
CREATE INDEX IF NOT EXISTS idx_student_reading_list_user_date
  ON student_reading_list (user_id, read_at DESC);
