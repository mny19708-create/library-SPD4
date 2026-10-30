CREATE DATABASE IF NOT EXISTS leafline_library
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE leafline_library;

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  role ENUM('student', 'staff', 'admin') NOT NULL DEFAULT 'student',
  full_name VARCHAR(150) NOT NULL,
  student_id VARCHAR(50) NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  faculty VARCHAR(120) NULL,
  study_year TINYINT UNSIGNED NULL,
  phone VARCHAR(30) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_student_id (student_id),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT chk_users_study_year CHECK (study_year IS NULL OR study_year BETWEEN 1 AND 10)
) ENGINE=InnoDB;

CREATE TABLE rooms (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  room_code VARCHAR(32) NOT NULL,
  building VARCHAR(120) NOT NULL,
  floor VARCHAR(32) NOT NULL,
  location_description VARCHAR(255) NULL,
  room_type ENUM('quiet_study', 'group', 'project', 'other') NOT NULL DEFAULT 'other',
  capacity SMALLINT UNSIGNED NOT NULL,
  status ENUM('available', 'occupied', 'maintenance', 'inactive') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rooms_room_code (room_code),
  KEY idx_rooms_status_floor (status, floor),
  CONSTRAINT chk_rooms_capacity CHECK (capacity > 0)
) ENGINE=InnoDB;

CREATE TABLE books (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  isbn VARCHAR(20) NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(180) NOT NULL,
  publisher VARCHAR(180) NULL,
  publication_year SMALLINT UNSIGNED NULL,
  category VARCHAR(120) NULL,
  shelf_location VARCHAR(120) NULL,
  digital_url VARCHAR(2048) NULL,
  digital_content LONGTEXT NULL,
  total_copies INT UNSIGNED NOT NULL DEFAULT 0,
  available_copies INT UNSIGNED NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_books_isbn (isbn),
  KEY idx_books_title (title),
  KEY idx_books_author (author),
  KEY idx_books_category (category),
  CONSTRAINT chk_books_stock CHECK (available_copies <= total_copies)
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  room_id BIGINT UNSIGNED NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  check_in_deadline DATETIME NOT NULL,
  qr_token_hash BINARY(32) NULL,
  qr_expires_at DATETIME NULL,
  checked_in_at DATETIME NULL,
  status ENUM('pending_checkin', 'checked_in', 'completed', 'cancelled', 'expired')
    NOT NULL DEFAULT 'pending_checkin',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_bookings_room_schedule (room_id, status, starts_at, ends_at),
  KEY idx_bookings_user_status (user_id, status, starts_at),
  KEY idx_bookings_checkin_deadline (status, check_in_deadline),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_bookings_time CHECK (
    ends_at > starts_at AND check_in_deadline <= ends_at
  ),
  CONSTRAINT chk_bookings_qr_expiry CHECK (
    (qr_token_hash IS NULL AND qr_expires_at IS NULL) OR
    (qr_token_hash IS NOT NULL AND qr_expires_at IS NOT NULL)
  )
) ENGINE=InnoDB;

CREATE TABLE book_reservations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED NOT NULL,
  reserved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  status ENUM('active', 'fulfilled', 'cancelled', 'expired') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_book_reservations_active (book_id, status, expires_at),
  KEY idx_book_reservations_user (user_id, status, expires_at),
  CONSTRAINT fk_book_reservations_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_book_reservations_book FOREIGN KEY (book_id) REFERENCES books (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_book_reservations_expiry CHECK (expires_at > reserved_at)
) ENGINE=InnoDB;

CREATE TABLE borrow_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED NOT NULL,
  reservation_id BIGINT UNSIGNED NULL,
  checked_out_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_at DATETIME NOT NULL,
  returned_at DATETIME NULL,
  status ENUM('borrowed', 'returned', 'lost') NOT NULL DEFAULT 'borrowed',
  renewal_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_borrow_logs_user_status (user_id, status, due_at),
  KEY idx_borrow_logs_book_status (book_id, status),
  CONSTRAINT fk_borrow_logs_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_borrow_logs_book FOREIGN KEY (book_id) REFERENCES books (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_borrow_logs_reservation FOREIGN KEY (reservation_id)
    REFERENCES book_reservations (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_borrow_logs_dates CHECK (
    due_at > checked_out_at AND (returned_at IS NULL OR returned_at >= checked_out_at)
  ),
  CONSTRAINT chk_borrow_logs_renewal CHECK (renewal_count <= 1)
) ENGINE=InnoDB;

CREATE TABLE certificates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  certificate_code VARCHAR(80) NOT NULL,
  title VARCHAR(180) NOT NULL,
  certificate_type VARCHAR(100) NOT NULL,
  points_spent INT UNSIGNED NOT NULL DEFAULT 0,
  file_url VARCHAR(2048) NULL,
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_certificates_code (certificate_code),
  KEY idx_certificates_user_issued (user_id, issued_at),
  CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE point_transactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  performed_by BIGINT UNSIGNED NULL,
  certificate_id BIGINT UNSIGNED NULL,
  transaction_type ENUM('earned', 'redeemed', 'adjustment') NOT NULL,
  points_change INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_point_transactions_certificate (certificate_id),
  KEY idx_point_transactions_user_time (user_id, created_at),
  CONSTRAINT fk_point_transactions_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_point_transactions_performer FOREIGN KEY (performed_by) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_point_transactions_certificate FOREIGN KEY (certificate_id)
    REFERENCES certificates (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_point_transactions_nonzero CHECK (points_change <> 0),
  CONSTRAINT chk_point_transactions_direction CHECK (
    (transaction_type = 'earned' AND points_change > 0) OR
    (transaction_type = 'redeemed' AND points_change < 0 AND certificate_id IS NOT NULL) OR
    transaction_type = 'adjustment'
  )
) ENGINE=InnoDB;
