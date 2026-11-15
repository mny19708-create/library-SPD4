-- 1. បង្កើត Table ប្រភេទសៀវភៅ (Categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. បង្កើត Table សៀវភៅ (Ebooks) ភ្ជាប់ជាមួយ Google Drive Link និង Categories
CREATE TABLE ebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL, -- Google Drive Direct Link
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    estimated_reading_time INTEGER DEFAULT 0
);
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    certificate_issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    certificate_issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reading_duration_minutes INTEGER DEFAULT 0,
    current_page INTEGER DEFAULT 0,
    last_read_at TIMESTAMP DEFAULT NOW(),
    reading_seconds INTEGER DEFAULT 0;
);
ALTER TABLE user_reading_progress 
ADD CONSTRAINT user_ebook_unique UNIQUE (user_id, ebook_id);
ALTER TABLE user_reading_progress 
ALTER COLUMN reading_duration_minutes TYPE INTEGER USING (reading_duration_minutes * 60);
ALTER TABLE user_reading_progress 
ALTER COLUMN reading_duration_minutes TYPE INTEGER USING (reading_duration_minutes / 60);
ALTER TABLE user_reading_progress
  ADD COLUMN IF NOT EXISTS reading_seconds INTEGER DEFAULT 0;

UPDATE user_reading_progress
SET reading_seconds = COALESCE(reading_duration_minutes, 0) * 60
WHERE COALESCE(reading_seconds, 0) = 0;

ALTER TABLE user_reading_progress
  ALTER COLUMN certificate_issued_at DROP DEFAULT;

UPDATE user_reading_progress
  SET certificate_issued_at = NULL
  WHERE is_completed = FALSE;
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,                        -- ត្រូវនឹង id ក្នុងតារាង users (UUID)
    book_id UUID NOT NULL,                        -- ត្រូវនឹង id ក្នុងតារាង public.ebooks (UUID)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- បញ្ជាក់ទំនាក់ទំនង Foreign Key ជាមួយតារាង users
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- បញ្ជាក់ទំនាក់ទំនង Foreign Key ជាមួយតារាង ebooks របស់អ្នក[cite: 7]
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES public.ebooks(id) ON DELETE CASCADE,
    
    -- ការពារមិនឱ្យ user Add សៀវភៅដដែលពីរដង
    CONSTRAINT unique_user_book UNIQUE (user_id, book_id)
);