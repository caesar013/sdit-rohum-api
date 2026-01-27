# SD IT Rohmatul Ummah - Backend Development Context

**Date:** January 27, 2026  
**Project:** Elementary School Website (SD IT Rohmatul Ummah)  
**Timeline:** 1 day remaining until deployment  
**Status:** ✅ Backend 95% Complete - 11 of 12 modules done (Downloads module skipped)

---

## Project Overview

A complete school website built with **Vue 3 + Vite + Tailwind CSS v4** frontend. Now building the backend API with **Express.js + MySQL**.

### Hosting Environment
- **cPanel** with Node.js support (Setup Node.js App available)
- **MySQL** database
- Shared hosting or VPS

---

## Frontend Pages Completed

All pages are fully built and styled, waiting for API integration:

### Public Pages
1. **Home** (`/`) - Hero, Stats, Principal Message, News, Video Profile, Quick Access, Footer
2. **Profil Menu:**
   - Identitas Sekolah (`/identitas-sekolah`) - School identity with contact info
   - Sejarah (`/sejarah`) - History timeline with achievements
   - Akreditasi (`/akreditasi`) - Accreditation details (Grade A)
   - Sarana Prasarana (`/sarana-prasarana`) - Facilities list
3. **Berita** (`/berita`) - News index with search & pagination
4. **Berita Detail** (`/berita/:slug`) - Full article with comments
5. **Direktori Menu:**
   - Peserta Didik (`/peserta-didik`) - Student directory with filters
   - Guru & Tendik (`/guru-tendik`) - Teacher/staff directory with modal
   - PD Non-Aktif (`/pd-non-aktif`) - Alumni directory with registration form
6. **Galeri:**
   - Galeri Foto (`/galeri-foto`) - Photo albums with lightbox modal
   - Galeri Video (`/galeri-video`) - Video gallery
7. **Unduhan** (`/unduhan`) - Downloads page (not yet built)
8. **Hubungi Kami** (`/hubungi-kami`) - Contact form with Google Maps

---

## Backend Technology Stack

```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "database": "MySQL",
  "authentication": "JWT (jsonwebtoken + bcrypt)",
  "validation": "express-validator",
  "fileUpload": "multer",
  "cors": "cors",
  "environment": "dotenv"
}
```

---

## Database Schema

### Tables Overview

1. **users** - Admin accounts
2. **school_profile** - Static school information
3. **news** - Articles/berita
4. **news_comments** - Comments on news articles
5. **teachers** - GTK (Guru & Tenaga Kependidikan)
6. **students** - Active students
7. **alumni** - Inactive students / alumni
8. **facilities** - Sarana prasarana
9. **photo_albums** - Photo album containers
10. **photos** - Individual photos
11. **videos** - Video gallery items
12. **downloads** - Downloadable files
13. **contact_messages** - Contact form submissions
14. **achievements** - School achievements (for Sejarah page)

### Detailed Schema (see SQL file)

Key relationships:
- `news` → `news_comments` (one-to-many)
- `photo_albums` → `photos` (one-to-many)
- `users` → all content tables (created_by foreign key)

---

## API Endpoints Needed

### Authentication
```
POST   /api/auth/login              - Admin login (returns JWT)
POST   /api/auth/logout             - Logout
GET    /api/auth/me                 - Get current admin user
POST   /api/auth/refresh            - Refresh token
```

### Public APIs (No Auth Required)

#### School Profile
```
GET    /api/school-profile          - Get school info (identitas)
GET    /api/school-profile/history  - Get history & timeline
GET    /api/school-profile/accreditation - Get accreditation info
```

#### News/Berita
```
GET    /api/news                    - List news (pagination, search)
GET    /api/news/:slug              - Get single news article
POST   /api/news/:id/comments       - Submit comment
GET    /api/news/:id/comments       - Get comments for article
```

#### Directories
```
GET    /api/teachers                - List teachers (search, filter by status)
GET    /api/teachers/:id            - Get teacher detail
GET    /api/students                - List students (filter by year, class)
GET    /api/alumni                  - List alumni (filter by year)
POST   /api/alumni/register         - Alumni self-registration
```

#### Galleries
```
GET    /api/photo-albums            - List photo albums (search)
GET    /api/photo-albums/:id        - Get album with photos
GET    /api/videos                  - List videos (search)
```

#### Facilities
```
GET    /api/facilities              - List facilities
```

#### Downloads
```
GET    /api/downloads               - List downloadable files
GET    /api/downloads/:id/file      - Download file
```

#### Contact
```
POST   /api/contact                 - Submit contact form
```

### Admin APIs (Auth Required - JWT)

All CRUD operations for:
```
/api/admin/news                      - News CRUD
/api/admin/teachers                  - Teachers CRUD
/api/admin/students                  - Students CRUD
/api/admin/alumni                    - Alumni CRUD
/api/admin/facilities                - Facilities CRUD
/api/admin/photo-albums              - Photo albums CRUD
/api/admin/photos                    - Photos CRUD (with upload)
/api/admin/videos                    - Videos CRUD
/api/admin/downloads                 - Downloads CRUD (with upload)
/api/admin/contact-messages          - View contact messages
/api/admin/school-profile            - Update school info
/api/admin/comments                  - Moderate comments (approve/delete)
```

---

## Authentication Flow

### Login Process
1. Admin enters credentials at `/admin/login` (frontend to be built)
2. POST `/api/auth/login` with email + password
3. Backend validates credentials (bcrypt compare)
4. Generate JWT token (expires in 24h)
5. Return token + user info
6. Frontend stores token in localStorage
7. Include token in all admin API requests: `Authorization: Bearer <token>`

### Middleware
```javascript
// Protect admin routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

---

## File Upload Strategy

### Photos
- Store in: `/uploads/photos/`
- Allowed: JPG, PNG, WEBP
- Max size: 5MB
- Generate thumbnails: 400x300 (optional)

### Videos
- Store YouTube/Vimeo URLs only (no upload)
- Field: `video_url` varchar(255)

### Downloads
- Store in: `/uploads/downloads/`
- Allowed: PDF, DOC, DOCX, XLS, XLSX
- Max size: 10MB

---

## Environment Variables (.env)

```env
# Server
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sdit_rohum

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=https://sditrohmatulummah.sch.id
```

---

## Project Structure (Backend)

```
sdit-rohum-api/
├── src/
│   ├── config/
│   │   └── database.js           # MySQL connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── upload.js             # Multer configuration
│   │   └── errorHandler.js       # Global error handler
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── news.routes.js
│   │   ├── teachers.routes.js
│   │   ├── students.routes.js
│   │   ├── alumni.routes.js
│   │   ├── galleries.routes.js
│   │   ├── facilities.routes.js
│   │   ├── contact.routes.js
│   │   ├── downloads.routes.js
│   │   └── admin/                # Admin-only routes
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── newsController.js
│   │   ├── teachersController.js
│   │   └── ...
│   ├── models/                   # Database query functions
│   │   ├── User.js
│   │   ├── News.js
│   │   └── ...
│   ├── validators/               # Input validation
│   │   ├── authValidator.js
│   │   └── ...
│   └── utils/
│       ├── jwt.js                # JWT helper functions
│       └── fileHelper.js         # File upload helpers
├── uploads/                      # Uploaded files
│   ├── photos/
│   └── downloads/
├── database/
│   └── schema.sql                # Database creation script
├── .env
├── .env.example
├── package.json
└── server.js                     # Entry point
```

---

## Development Roadmap (4 Days)

### Day 1: Foundation (TODAY)
- [x] Create Express project structure
- [ ] Design & create MySQL database schema
- [ ] Set up database connection
- [ ] Build authentication system (login, JWT)
- [ ] Create auth middleware
- [ ] Test login endpoint

### Day 2: Core Public APIs
- [ ] News API (list, detail, comments)
- [ ] School profile APIs (identitas, sejarah, akreditasi)
- [ ] Facilities API
- [ ] Contact form API
- [ ] Test all public endpoints

### Day 3: Directories & Galleries
- [ ] Teachers API (with search/filter)
- [ ] Students API (with filters)
- [ ] Alumni API + registration
- [ ] Photo albums & photos API
- [ ] Videos API
- [ ] Test all directory endpoints

### Day 4: Admin Panel & Polish
- [ ] Admin CRUD routes (all resources)
- [ ] File upload (photos, downloads)
- [ ] Downloads API
- [ ] Build simple admin login page (Vue)
- [ ] Final testing
- [ ] Deploy to cPanel

---

## Frontend Integration Points

All frontend pages have commented `// TODO:` markers indicating where to connect APIs:

### Example (News.vue):
```javascript
const handleSearch = () => {
  // TODO: Implement search functionality with backend API
  currentPage.value = 1
}
```

### Replace with:
```javascript
const handleSearch = async () => {
  const response = await fetch(`/api/news?search=${searchQuery.value}&page=${currentPage.value}`);
  const data = await response.json();
  allNews.value = data.news;
  totalPages.value = data.totalPages;
}
```

---

## Important Notes

1. **Admin Panel**: Need to build a simple admin dashboard (Vue) for CRUD operations
   - Login page: `/admin/login`
   - Dashboard: `/admin/dashboard`
   - Content management pages for each resource

2. **Image Optimization**: Consider using Sharp.js for image resizing (optional)

3. **Validation**: Use express-validator for all input validation

4. **Error Handling**: Consistent error response format:
   ```json
   {
     "success": false,
     "error": "Error message here"
   }
   ```

5. **Success Response**: Consistent success format:
   ```json
   {
     "success": true,
     "data": { ... }
   }
   ```

6. **Pagination**: Standard format:
   ```json
   {
     "success": true,
     "data": [...],
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 50,
       "totalPages": 5
     }
   }
   ```

---

## Default Admin Account

Create in database after schema setup:
- Email: `admin@sditrohmatulummah.sch.id`
- Password: `Admin123!` (hash with bcrypt, change after first login)

---

## ✅ Completed Modules (11/12)

### 1. Authentication ✅
- JWT-based login/logout
- Password hashing with bcrypt
- Token refresh mechanism
- Protected admin routes

### 2. School Profile ✅
- Key-value storage structure
- CRUD operations for school data
- Public read, admin write

### 3. News Management ✅
- Full CRUD with slug generation
- Status management (draft/published)
- Category filtering
- Pagination and search
- Dynamic field updates pattern

### 4. Videos ✅
- YouTube/Vimeo platform support
- Thumbnail URL extraction
- Category filtering
- Public listing

### 5. Photo Galleries ✅
- Album-based organization
- Smart image upload with Sharp
- Duplicate detection via perceptual hash
- Lightbox-ready responses

### 6. Contact Messages ✅
- Public submission endpoint
- Admin viewing with filters
- Status tracking (new/read/replied)
- Email and phone validation

### 7. Teachers ✅
- Teacher and staff directory
- Photo upload with duplicate detection
- Status filtering (active/inactive/retired)
- Subject specialization tracking

### 8. Facilities ✅
- Facility management with photos
- Category classification (classroom/lab/sport/etc)
- Condition tracking (good/fair/poor/damaged)
- Year of acquisition tracking

### 9. Achievements ✅
- Achievement records
- Category (academic/sport/art/other)
- Level (school/district/city/province/national/international)
- Year-based organization

### 10. Students ✅ (NEW - Normalized Structure)
- **Normalized database structure** to avoid bloat:
  - `academic_years` table (e.g., "2024/2025")
  - `classes` table (links grades to academic years)
  - `student_enrollments` many-to-many (tracks history)
- **Smart filtering** by academic year and grade
- **Enrollment history** tracking across years
- **Active year management** with transaction-based switching
- Photo upload with duplicate detection
- Public listing with privacy controls

### 11. Alumni ✅ (NEW - Public Registration)
- **Separate table** for graduated students
- **Public self-registration** feature
- **Admin approval workflow** (pending → approved/rejected)
- Public endpoints show only approved alumni
- Admin endpoints with full status filtering
- Photo upload support

### 12. Downloads ❌ (SKIPPED)
- Client decided to skip this module

---

## Code Quality Patterns Implemented

### 1. Enum Constants
All database ENUMs exported as constants from `src/constants/`:
```javascript
export const NEWS_STATUS = {
  draft: { value: 'draft', label: 'Draft' },
  published: { value: 'published', label: 'Published' }
};
```

### 2. Dynamic Field Updates (Loop Pattern)
Models use `allowedFields` array to avoid repetitive if statements:
```javascript
const allowedFields = ['name', 'email', 'phone', 'address'];
allowedFields.forEach(field => {
  if (data[field] !== undefined) {
    fields.push(`${field} = ?`);
    values.push(data[field]);
  }
});
```

### 3. Smart Image Handling
Uses `handleImageUpdate` function for duplicate detection:
```javascript
const result = await handleImageUpdate({
  newImagePath: req.file.path,
  oldImagePath: existingRecord.photo_url
});
// Returns: { finalPath, isDuplicate }
// Compares perceptual hashes to avoid uploading identical images
```

### 4. Complex JOINs for Filtering
Student model uses conditional JOINs:
```javascript
// Only JOIN enrollment tables when filtering by academic_year or grade
if (academic_year || grade) {
  query += ` INNER JOIN student_enrollments se ON s.id = se.student_id
             INNER JOIN classes c ON se.class_id = c.id
             INNER JOIN academic_years ay ON c.academic_year_id = ay.id`;
}
```

### 5. Transaction-Based Operations
Academic year activation uses MySQL transactions:
```javascript
const connection = await pool.getConnection();
await connection.beginTransaction();
try {
  await connection.query('UPDATE academic_years SET is_active = FALSE');
  await connection.query('UPDATE academic_years SET is_active = TRUE WHERE id = ?', [id]);
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
}
```

---

## Database Structure (Normalized)

### Academic Years & Student Enrollment
```
academic_years (id, year, is_active)
    ↓
classes (id, grade, academic_year_id)
    ↓
student_enrollments (student_id, class_id)  ← many-to-many junction
    ↓
students (nisn, nis, name, photo, parent_info, status)
```

**Benefits:**
- No redundant class/year columns in students table
- Full enrollment history tracking
- Efficient filtering: `?academic_year=2024/2025&grade=5`
- Single active year enforced by database

---

## API Documentation

**📚 Complete API Reference:** See `/docs/API_DOCUMENTATION.md`

Comprehensive documentation covering all 77 endpoints across 11 modules including:
- Authentication & authorization
- School profile management
- Content management (news, videos, galleries)
- Directory systems (teachers, students, alumni)
- Facility & achievement tracking
- Smart filtering & enrollment history
- Public registration workflows

---

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Upload backend to cPanel via Node.js App manager
- [ ] Import database schema to production MySQL
- [ ] Configure CORS for production domain
- [ ] Test all API endpoints
- [ ] Update frontend API base URL
- [ ] Build frontend (`npm run build`)
- [ ] Upload frontend dist/ to public_html
- [ ] Test full application flow
- [ ] Change default admin password
- [ ] Enable HTTPS

---

## Next Steps (New Conversation)

Start with:
1. **Create Express project structure** with all folders
2. **Generate database schema SQL file** with all tables
3. **Build authentication system** (login, JWT middleware)
4. Test authentication before proceeding

**Command to start:**
```bash
cd /home/caesar/projects
mkdir sdit-rohum-api
cd sdit-rohum-api
npm init -y
```

---

## Questions for Next Session

1. Confirm MySQL database credentials available?
2. Prefer ES6 modules (import/export) or CommonJS (require)?
3. Need password reset functionality for admin?
4. Should alumni approval be manual or automatic?

---

**Last Updated:** January 24, 2026  
**Frontend Repository:** /home/caesar/projects/sdit-rohum  
**Backend Repository:** /home/caesar/projects/sdit-rohum-api (to be created)
