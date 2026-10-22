CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    room_name VARCHAR(100),
    type VARCHAR(50) DEFAULT 'Lecture',
    building VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    facilities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rooms (room_number, room_name, type, building, floor, capacity, status, facilities)
VALUES 
('A-101', 'បន្ទប់សិក្សាទូទៅ', 'Lecture', 'អាគារ A', 1, 40, 'Available', 'Projector, Air Conditioner'),
('B-201', 'បន្ទប់កុំព្យូទ័រ', 'Lab', 'អាគារ B', 2, 30, 'Occupied', '30 PCs, Projector');


-- ១. លុប Table ចាស់ចោលប្រសិនបើមាន
DROP TABLE IF EXISTS rooms CASCADE;

-- ២. បង្កើត Table rooms ឱ្យត្រូវនឹងទម្រង់ UI
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,                                -- ឧ. 'Room 101'
    status VARCHAR(20) NOT NULL DEFAULT 'available'                  -- 'available', 'reserved', 'occupied'
        CHECK (status IN ('available', 'reserved', 'occupied')),
    "user" VARCHAR(100) DEFAULT NULL,                                -- ឈ្មោះអ្នកប្រើប្រាស់ (User)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rooms (id, name, status, "user")
VALUES 
(1, 'Room 101', 'available', NULL),
(2, 'Room 102', 'reserved', 'Dara'),
(3, 'Room 103', 'occupied', 'Sophea'),
(4, 'Room 104', 'available', NULL)
ON CONFLICT (id) DO NOTHING;

-- កំណត់ sequence របស់ id ឱ្យរត់បន្ត
SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));

-- ១. បន្ថែម Column ចាំបាច់សម្រាប់គណនាម៉ោង និងទីតាំង
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT 11.5168,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT 104.6664;

-- ២. កំណត់ទីតាំងបន្ទប់នៅបរិវេណ Digital University of Cambodia
UPDATE rooms 
SET latitude = 11.5168, 
    longitude = 104.6664;

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ DEFAULT NOW();


TRUNCATE TABLE admin_users RESTART IDENTITY CASCADE;

-- ១. សម្អាតទិន្នន័យ admin_users ចាស់
TRUNCATE TABLE admin_users RESTART IDENTITY CASCADE;

-- ២. បញ្ចូលគណនី 'roth' ជាមួយ password 'povratha19@@2026' ដែលបាន hash រួចស្រេច
INSERT INTO admin_users (username, display_name, password_salt, password_hash)
VALUES (
    'roth',
    'roth',
    'e7a4b8c91029384756abcdef12345678',
    'd8f61537021ecba81b498f39567c9d09a4716b71382410a887b32f913d0859a164b1897b610c3d9735467027b6863c3d526e06b9868846c4f87747e06a38259b'
);