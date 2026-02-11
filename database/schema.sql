-- ============================================
-- SD IT Rohmatul Ummah - Database Schema
-- Created: January 24, 2026
-- Database: MySQL 8.0
-- ============================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS sdit_rohum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sdit_rohum;

-- ============================================
-- Table: users (Admin accounts)
-- ============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'super_admin') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: school_profile (Key-Value Structure)
-- ============================================
CREATE TABLE school_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: achievements
-- ============================================
CREATE TABLE achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  achievement_year YEAR NOT NULL,
  category ENUM('academic', 'sport', 'art', 'other') DEFAULT 'other',
  level ENUM('school', 'district', 'city', 'province', 'national', 'international') DEFAULT 'school',
  certification_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_year (achievement_year),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: news
-- ============================================
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  featured_image VARCHAR(255),
  category ENUM('announcement', 'event', 'achievement', 'general') DEFAULT 'general',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_published (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: news_comments
-- ============================================
CREATE TABLE news_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  news_id INT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
  INDEX idx_news (news_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: teachers
-- ============================================
CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nip VARCHAR(30),
  name VARCHAR(100) NOT NULL,
  photo_url VARCHAR(255),
  position VARCHAR(100),
  subject VARCHAR(100),
  status ENUM('active', 'inactive', 'retired') DEFAULT 'active',
  education_level VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  joined_date DATE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: academic_years
-- ============================================
CREATE TABLE academic_years (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year VARCHAR(20) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_year (year),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: classes
-- ============================================
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grade INT NOT NULL,
  academic_year_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
  UNIQUE KEY unique_class (grade, academic_year_id),
  INDEX idx_grade (grade),
  INDEX idx_academic_year (academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: students
-- ============================================
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nisn VARCHAR(20) NOT NULL UNIQUE,
  nis VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  photo_url VARCHAR(255),
  gender ENUM('male', 'female') NOT NULL,
  birth_place VARCHAR(100),
  birth_date DATE,
  status ENUM('active', 'inactive', 'graduated', 'transferred') DEFAULT 'active',
  parent_name VARCHAR(100),
  parent_phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nisn (nisn),
  INDEX idx_status (status),
  INDEX idx_gender (gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: student_enrollments
-- ============================================
CREATE TABLE student_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, class_id),
  INDEX idx_student (student_id),
  INDEX idx_class (class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: alumni
-- ============================================
CREATE TABLE alumni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nisn VARCHAR(20),
  name VARCHAR(100) NOT NULL,
  photo_url VARCHAR(255),
  gender ENUM('male', 'female') NOT NULL,
  graduation_year YEAR NOT NULL,
  current_school VARCHAR(200),
  current_occupation VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  registration_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_graduation_year (graduation_year),
  INDEX idx_status (registration_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: facilities
-- ============================================
CREATE TABLE facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  photo_url VARCHAR(255),
  category ENUM('classroom', 'laboratory', 'library', 'sports', 'mosque', 'other') DEFAULT 'other',
  quantity INT DEFAULT 1,
  condition_status ENUM('good', 'fair', 'needs_repair') DEFAULT 'good',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: photo_albums
-- ============================================
CREATE TABLE photo_albums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  cover_photo VARCHAR(255),
  album_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_date (album_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: photos
-- ============================================
CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES photo_albums(id) ON DELETE CASCADE,
  INDEX idx_album (album_id),
  INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: videos
-- ============================================
CREATE TABLE videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  video_url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255),
  platform ENUM('youtube', 'vimeo', 'other') DEFAULT 'youtube',
  duration VARCHAR(20),
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_platform (platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: downloads
-- ============================================
CREATE TABLE downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  category ENUM('form', 'guideline', 'schedule', 'report', 'other') DEFAULT 'other',
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: contact_messages
-- ============================================
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Default Admin User
-- Password: password123 (hashed with bcrypt)
-- ============================================
INSERT INTO users (name, email, password, role, is_active) VALUES
('Administrator', 'admin@sditrohum.sch.id', '$2b$10$RNqDUk9Xq7aZMCmx1sBvGuDUpBnPrkngIhsLE1FTKflkN/vyeZBAi', 'super_admin', TRUE);

-- ============================================
-- Insert School Profile Data
-- ============================================
INSERT INTO school_profile (`key`, `value`) VALUES
  ('school_name', 'SD IT Rohmatul Ummah'),
  ('npsn', '20528764'),
  ('address', 'Jl. Pendidikan No. 123, Kota Anda'),
  ('phone', '(021) 1234567'),
  ('email', 'info@sditrohum.sch.id'),
  ('website', 'https://sditrohum.sch.id'),
  ('principal_name', 'Dr. Ahmad Hidayat, M.Pd'),
  ('principal_message', 'Assalamualaikum warahmatullahi wabarakatuh. Selamat datang di SD IT Rohmatul Ummah. Kami berkomitmen untuk memberikan pendidikan terbaik yang mengintegrasikan ilmu pengetahuan dengan nilai-nilai Islam.'),
  ('established_year', '2010'),
  ('accreditation', 'A'),
  ('accreditation_year', '2023'),
  ('logo_url', ''),
  ('vision', 'Menjadi sekolah Islam terpadu yang unggul dalam prestasi dan berakhlak mulia'),
  ('mission', 'Menyelenggarakan pendidikan Islam yang berkualitas; Membentuk generasi yang cerdas, kreatif, dan berakhlak mulia; Menciptakan lingkungan belajar yang kondusif dan Islami');

-- ============================================
-- Insert Sample Achievements
-- ============================================
INSERT INTO achievements (title, description, achievement_year, category, level) VALUES
('Juara 1 Olimpiade Matematika', 'Meraih juara pertama dalam Olimpiade Matematika tingkat provinsi', 2024, 'academic', 'province'),
('Juara 2 Lomba Tahfidz', 'Prestasi gemilang dalam lomba tahfidz Al-Quran tingkat kota', 2024, 'other', 'city'),
('Juara 1 Futsal Pelajar', 'Tim futsal putra berhasil meraih juara 1 tingkat kecamatan', 2023, 'sport', 'district'),
('Juara 3 Lomba Sains Nasional', 'Kompetisi sains nasional kategori IPA', 2023, 'academic', 'national'),
('Juara 1 Kaligrafi', 'Lomba kaligrafi tingkat kota untuk kategori SD', 2024, 'art', 'city');

-- ============================================
-- Insert Sample News
-- ============================================
INSERT INTO news (title, slug, content, excerpt, category, status, published_at, views) VALUES
('Penerimaan Siswa Baru Tahun Ajaran 2026/2027', 'penerimaan-siswa-baru-2026-2027', 
'SD IT Rohmatul Ummah membuka pendaftaran siswa baru untuk tahun ajaran 2026/2027. Pendaftaran dibuka mulai 1 Februari 2026 hingga 30 April 2026. Tersedia berbagai fasilitas modern dan tenaga pengajar berkualitas.', 
'Pendaftaran siswa baru tahun ajaran 2026/2027 dibuka mulai 1 Februari hingga 30 April 2026', 
'announcement', 'published', NOW(), 150),

('Peringatan Maulid Nabi Muhammad SAW 1448 H', 'peringatan-maulid-nabi-1448h',
'Dalam rangka memperingati Maulid Nabi Muhammad SAW, SD IT Rohmatul Ummah mengadakan serangkaian kegiatan seperti lomba tartil, lomba adzan, dan ceramah Islami. Kegiatan ini bertujuan untuk meningkatkan kecintaan siswa terhadap Rasulullah.', 
'Peringatan Maulid Nabi dengan berbagai lomba dan ceramah Islami', 
'event', 'published', NOW(), 89),

('Siswa SD IT Rohmatul Ummah Raih Juara Olimpiade', 'siswa-raih-juara-olimpiade',
'Membanggakan! Siswa kelas 6 SD IT Rohmatul Ummah berhasil meraih juara 1 dalam Olimpiade Matematika tingkat provinsi. Prestasi ini membuktikan kualitas pendidikan di sekolah kami.', 
'Siswa kelas 6 raih juara 1 Olimpiade Matematika tingkat provinsi', 
'achievement', 'published', NOW(), 210),

('Kegiatan Outing Class ke Kebun Binatang', 'kegiatan-outing-class',
'Siswa kelas 1-3 mengikuti kegiatan outing class ke kebun binatang. Kegiatan ini bertujuan untuk memberikan pembelajaran di luar kelas tentang flora dan fauna.', 
'Outing class siswa kelas 1-3 ke kebun binatang untuk pembelajaran outdoor', 
'event', 'published', NOW(), 76),

('Pelaksanaan Ujian Tengah Semester Genap', 'ujian-tengah-semester-genap',
'Pelaksanaan Ujian Tengah Semester (UTS) Genap akan dilaksanakan pada tanggal 10-14 Maret 2026. Siswa diharapkan mempersiapkan diri dengan baik.', 
'UTS Genap dilaksanakan 10-14 Maret 2026', 
'announcement', 'published', NOW(), 134);

-- ============================================
-- Insert Sample News Comments
-- ============================================
INSERT INTO news_comments (news_id, author_name, author_email, comment, status) VALUES
(1, 'Budi Santoso', 'budi@email.com', 'Alhamdulillah, semoga pendaftaran tahun ini lancar', 'approved'),
(1, 'Siti Aminah', 'siti@email.com', 'Kapan jadwal tes masuknya?', 'approved'),
(3, 'Ahmad Rifai', 'ahmad@email.com', 'Masyaallah, selamat untuk siswa yang berprestasi!', 'approved'),
(3, 'Fatimah Zahra', 'fatimah@email.com', 'Bangga dengan prestasi sekolah ini', 'approved'),
(2, 'Muhammad Yusuf', 'yusuf@email.com', 'Kegiatan yang sangat bermanfaat', 'approved');

-- ============================================
-- Insert Sample Teachers
-- ============================================
INSERT INTO teachers (nip, name, position, subject, status, education_level, phone, email, joined_date) VALUES
('198501122010012001', 'Dra. Siti Nurhaliza', 'Guru Kelas 1', 'Tematik', 'active', 'S1 PGSD', '081234567890', 'siti.nurhaliza@sditrohum.sch.id', '2015-07-01'),
('198703152011012002', 'Ahmad Fauzi, S.Pd', 'Guru Kelas 2', 'Tematik', 'active', 'S1 PGSD', '081234567891', 'ahmad.fauzi@sditrohum.sch.id', '2016-08-01'),
('199001202012011003', 'Nurlaela Sari, S.Pd.I', 'Guru PAI', 'Pendidikan Agama Islam', 'active', 'S1 PAI', '081234567892', 'nurlaela@sditrohum.sch.id', '2017-01-15'),
('198905082013012004', 'Rini Wulandari, S.Pd', 'Guru Bahasa Inggris', 'Bahasa Inggris', 'active', 'S1 Pendidikan Bahasa Inggris', '081234567893', 'rini@sditrohum.sch.id', '2018-07-10'),
('199203152014011005', 'Yoga Pratama, S.Pd', 'Guru Penjaskes', 'Pendidikan Jasmani', 'active', 'S1 Penjaskes', '081234567894', 'yoga@sditrohum.sch.id', '2019-08-01');

-- ============================================
-- Insert Sample Academic Years (Past 4 years)
-- ============================================
INSERT INTO academic_years (year, is_active) VALUES
('2022/2023', FALSE),
('2023/2024', FALSE),
('2024/2025', FALSE),
('2025/2026', TRUE);

-- ============================================
-- Insert Sample Classes (Grades 1-6 for each year)
-- ============================================
INSERT INTO classes (grade, academic_year_id) VALUES
-- 2024/2025 (id=3)
(1, 3), (2, 3), (3, 3), (4, 3), (5, 3), (6, 3),
-- 2025/2026 (id=4)
(1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4);

-- ============================================
-- Insert Sample Students
-- ============================================
INSERT INTO students (nisn, nis, name, gender, birth_place, birth_date, status, parent_name, parent_phone) VALUES
('0123456789', '2024001', 'Muhammad Rizki Pratama', 'male', 'Jakarta', '2015-03-15', 'active', 'Bapak Pratama', '081234561111'),
('0123456790', '2024002', 'Aisyah Putri Azzahra', 'female', 'Bandung', '2015-05-20', 'active', 'Ibu Azzahra', '081234561112'),
('0123456791', '2024003', 'Ahmad Hafidz Rahman', 'male', 'Surabaya', '2016-08-10', 'active', 'Bapak Rahman', '081234561113'),
('0123456792', '2024004', 'Fatimah Zahra', 'female', 'Yogyakarta', '2016-11-25', 'active', 'Ibu Zahra', '081234561114'),
('0123456793', '2024005', 'Umar Faruq Abdullah', 'male', 'Semarang', '2017-02-14', 'active', 'Bapak Abdullah', '081234561115'),
('0123456794', '2023006', 'Zahra Kamila', 'female', 'Medan', '2016-04-18', 'active', 'Ibu Kamila', '081234561116'),
('0123456795', '2023007', 'Faris Maulana', 'male', 'Malang', '2015-09-22', 'active', 'Bapak Maulana', '081234561117'),
('0123456796', '2023008', 'Naila Syifa', 'female', 'Solo', '2017-06-30', 'active', 'Ibu Syifa', '081234561118');

-- ============================================
-- Insert Sample Student Enrollments (2 years)
-- ============================================
-- 2024/2025 Enrollments
INSERT INTO student_enrollments (student_id, class_id) VALUES
-- Grade 3 in 2024/2025 (Muhammad Rizki - now Grade 4)
(1, 3), -- class_id 3 = Grade 3, 2024/2025
-- Grade 3 in 2024/2025 (Aisyah Putri - now Grade 4)
(2, 3),
-- Grade 2 in 2024/2025 (Ahmad Hafidz - now Grade 3)
(3, 2),
-- Grade 2 in 2024/2025 (Fatimah Zahra - now Grade 3)
(4, 2),
-- Grade 1 in 2024/2025 (Umar Faruq - now Grade 2)
(5, 1),
-- Grade 2 in 2024/2025 (Zahra Kamila - now Grade 3)
(6, 2),
-- Grade 4 in 2024/2025 (Faris Maulana - now Grade 5)
(7, 4),
-- Grade 1 in 2024/2025 (Naila Syifa - now Grade 2)
(8, 1);

-- 2025/2026 Enrollments (Current Year)
INSERT INTO student_enrollments (student_id, class_id) VALUES
-- Grade 4 in 2025/2026 (Muhammad Rizki)
(1, 10), -- class_id 10 = Grade 4, 2025/2026
-- Grade 4 in 2025/2026 (Aisyah Putri)
(2, 10),
-- Grade 3 in 2025/2026 (Ahmad Hafidz)
(3, 9),
-- Grade 3 in 2025/2026 (Fatimah Zahra)
(4, 9),
-- Grade 2 in 2025/2026 (Umar Faruq)
(5, 8),
-- Grade 3 in 2025/2026 (Zahra Kamila)
(6, 9),
-- Grade 5 in 2025/2026 (Faris Maulana)
(7, 11),
-- Grade 2 in 2025/2026 (Naila Syifa)
(8, 8);

-- ============================================
-- Insert Sample Alumni
-- ============================================
INSERT INTO alumni (nisn, name, gender, graduation_year, current_school, phone, email, registration_status) VALUES
('0111111111', 'Farhan Maulana', 'male', 2023, 'SMP Negeri 1', '081234560001', 'farhan@email.com', 'approved'),
('0111111112', 'Nabila Syifa', 'female', 2023, 'SMP Negeri 2', '081234560002', 'nabila@email.com', 'approved'),
('0111111113', 'Zaki Ramadhan', 'male', 2022, 'SMP Al-Azhar', '081234560003', 'zaki@email.com', 'approved'),
('0111111114', 'Khansa Aulia', 'female', 2022, 'SMP Islam Terpadu', '081234560004', 'khansa@email.com', 'approved'),
('0111111115', 'Rayhan Maulana', 'male', 2024, 'SMP Negeri 5', '081234560005', 'rayhan@email.com', 'pending');

-- ============================================
-- Insert Sample Facilities
-- ============================================
INSERT INTO facilities (name, description, category, quantity, condition_status) VALUES
('Ruang Kelas', 'Ruang kelas ber-AC dengan kapasitas 30 siswa', 'classroom', 12, 'good'),
('Laboratorium Komputer', 'Lab komputer dengan 40 unit PC dan proyektor', 'laboratory', 1, 'good'),
('Perpustakaan', 'Perpustakaan dengan koleksi 5000+ buku', 'library', 1, 'good'),
('Lapangan Futsal', 'Lapangan futsal outdoor dengan rumput sintetis', 'sports', 1, 'fair'),
('Masjid', 'Masjid sekolah dengan kapasitas 200 jamaah', 'mosque', 1, 'good');

-- ============================================
-- Insert Sample Photo Albums
-- ============================================
INSERT INTO photo_albums (title, slug, description, album_date) VALUES
('Kegiatan Pramuka 2025', 'kegiatan-pramuka-2025', 'Dokumentasi kegiatan pramuka bulanan', '2025-09-15'),
('Peringatan HUT RI ke-80', 'peringatan-hut-ri-80', 'Upacara dan lomba 17 Agustus', '2025-08-17'),
('Manasik Haji', 'manasik-haji-2025', 'Kegiatan manasik haji siswa kelas 6', '2025-10-20'),
('Outing Class ke Museum', 'outing-class-museum', 'Kunjungan edukatif ke Museum Nasional', '2025-11-05'),
('Lomba Sains 2025', 'lomba-sains-2025', 'Kompetisi sains antar kelas', '2025-12-10');

-- ============================================
-- Insert Sample Photos
-- ============================================
INSERT INTO photos (album_id, photo_url, caption, display_order) VALUES
(1, '/uploads/photos/pramuka-1.jpg', 'Pembukaan kegiatan pramuka', 1),
(1, '/uploads/photos/pramuka-2.jpg', 'Latihan baris berbaris', 2),
(2, '/uploads/photos/hut-ri-1.jpg', 'Upacara bendera', 1),
(2, '/uploads/photos/hut-ri-2.jpg', 'Lomba balap karung', 2),
(3, '/uploads/photos/manasik-1.jpg', 'Praktik thawaf', 1);

-- ============================================
-- Insert Sample Videos
-- ============================================
INSERT INTO videos (title, description, video_url, platform) VALUES
('Profil SD IT Rohmatul Ummah', 'Video profil sekolah tahun 2025', 'https://youtube.com/watch?v=example1', 'youtube'),
('Kegiatan Ekstrakurikuler', 'Dokumentasi berbagai kegiatan ekstrakurikuler', 'https://youtube.com/watch?v=example2', 'youtube'),
('Virtual Tour Sekolah', 'Tour virtual fasilitas sekolah', 'https://youtube.com/watch?v=example3', 'youtube'),
('Prestasi Siswa 2024', 'Kompilasi prestasi siswa tahun 2024', 'https://youtube.com/watch?v=example4', 'youtube'),
('Kegiatan Ramadhan', 'Kegiatan pesantren Ramadhan', 'https://youtube.com/watch?v=example5', 'youtube');

-- ============================================
-- Insert Sample Downloads
-- ============================================
INSERT INTO downloads (title, description, file_url, file_name, file_type, file_size, category) VALUES
('Formulir Pendaftaran Siswa Baru', 'Formulir pendaftaran untuk calon siswa baru', '/uploads/downloads/form-psb.pdf', 'form-psb.pdf', 'application/pdf', 245760, 'form'),
('Kalender Akademik 2025/2026', 'Kalender akademik tahun ajaran 2025/2026', '/uploads/downloads/kalender-akademik.pdf', 'kalender-akademik.pdf', 'application/pdf', 512000, 'schedule'),
('Panduan Orang Tua', 'Panduan untuk orang tua siswa', '/uploads/downloads/panduan-ortu.pdf', 'panduan-ortu.pdf', 'application/pdf', 358400, 'guideline'),
('Jadwal Pelajaran Semester Genap', 'Jadwal pelajaran semester genap 2025/2026', '/uploads/downloads/jadwal-pelajaran.pdf', 'jadwal-pelajaran.pdf', 'application/pdf', 184320, 'schedule'),
('Laporan Kegiatan Tahunan', 'Laporan kegiatan sekolah tahun 2024', '/uploads/downloads/laporan-2024.pdf', 'laporan-2024.pdf', 'application/pdf', 1048576, 'report');

-- ============================================
-- Insert Sample Contact Messages
-- ============================================
INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES
('Andi Wijaya', 'andi@email.com', '081234567801', 'Informasi Pendaftaran', 'Saya ingin menanyakan persyaratan pendaftaran siswa baru', 'read'),
('Dewi Lestari', 'dewi@email.com', '081234567802', 'Biaya Pendidikan', 'Mohon informasi mengenai rincian biaya pendidikan', 'unread'),
('Rudi Hartono', 'rudi@email.com', '081234567803', 'Ekstrakurikuler', 'Apa saja ekstrakurikuler yang tersedia?', 'replied'),
('Susi Rahayu', 'susi@email.com', '081234567804', 'Fasilitas Sekolah', 'Bagaimana fasilitas yang tersedia di sekolah?', 'read'),
('Tono Sugiarto', 'tono@email.com', '081234567805', 'Program Tahfidz', 'Apakah ada program tahfidz untuk siswa?', 'unread');

-- ============================================
-- End of Schema
-- ============================================
