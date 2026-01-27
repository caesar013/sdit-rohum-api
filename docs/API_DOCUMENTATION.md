# SD IT Rohmatul Ummah - Backend API Documentation

**Last Updated:** January 27, 2026  
**Version:** 1.0  
**Base URL:** `http://localhost:3000/api` (development)

---

## Authentication

All admin endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login with username/password | No |
| POST | `/api/auth/register` | Register new admin account | No |
| GET | `/api/auth/me` | Get current authenticated user | Yes |

---

## School Profile

Key-value based school information storage.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/school-profile` | Get all school profile data | No |
| GET | `/api/school-profile/:key` | Get specific profile value by key | No |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/school-profile` | Create new profile key-value | Yes |
| PUT | `/api/admin/school-profile/:key` | Update profile value by key | Yes |
| DELETE | `/api/admin/school-profile/:key` | Delete profile key-value | Yes |

**Common Keys:** `school_name`, `address`, `phone`, `email`, `principal_name`, `vision`, `mission`, `accreditation`, `npsn`, `established_year`, `history`, etc.

---

## News Management

News articles with categories, status management, and slug-based URLs.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/news` | List all published news (pagination, search, category filter) | No |
| GET | `/api/news/categories` | Get available news categories | No |
| GET | `/api/news/slug/:slug` | Get single news article by slug | No |
| GET | `/api/news/:id` | Get single news article by ID | No |

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title/content
- `category` - Filter by category
- `status` - Filter by status (admin only)

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/news` | Get all news (including drafts) | Yes |
| GET | `/api/admin/news/:id` | Get news by ID (no view increment) | Yes |
| POST | `/api/admin/news` | Create new news article (with image upload) | Yes |
| PUT | `/api/admin/news/:id` | Update news article (with image upload) | Yes |
| DELETE | `/api/admin/news/:id` | Delete news article | Yes |

**Available Categories:** `academic`, `achievement`, `event`, `announcement`, `other`  
**Available Status:** `draft`, `published`

---

## Videos

Video gallery with YouTube/Vimeo support.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/videos` | List all videos (pagination, search, category filter) | No |
| GET | `/api/videos/categories` | Get available video categories | No |
| GET | `/api/videos/:id` | Get single video by ID | No |

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search in title/description
- `category` - Filter by category
- `platform` - Filter by platform (youtube/vimeo)

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/videos` | Create new video | Yes |
| PUT | `/api/admin/videos/:id` | Update video | Yes |
| DELETE | `/api/admin/videos/:id` | Delete video | Yes |

**Available Platforms:** `youtube`, `vimeo`  
**Available Categories:** `profile`, `activity`, `achievement`, `event`, `other`

---

## Photo Galleries

Photo albums with smart image upload and duplicate detection.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/gallery` | List all photo albums (pagination, search) | No |
| GET | `/api/gallery/:id` | Get album with all photos | No |

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search in album title/description

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/gallery/albums/:id` | Get album by ID | Yes |
| POST | `/api/admin/gallery/albums` | Create new photo album (with cover upload) | Yes |
| PUT | `/api/admin/gallery/albums/:id` | Update album (with cover upload) | Yes |
| DELETE | `/api/admin/gallery/albums/:id` | Delete album and all photos | Yes |
| POST | `/api/admin/gallery/albums/:albumId/photos` | Add photo to album (with image upload) | Yes |
| PUT | `/api/admin/gallery/photos/:id` | Update photo (with image upload) | Yes |
| DELETE | `/api/admin/gallery/photos/:id` | Delete photo from album | Yes |
| PUT | `/api/admin/gallery/albums/:albumId/photos/reorder` | Reorder photos in album | Yes |

**Features:** Perceptual hash-based duplicate detection, automatic image optimization

---

## Contact Messages

Contact form submissions from website visitors.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/contact` | Submit contact form | No |

**Required Fields:** `name`, `email`, `subject`, `message`

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/contact` | List all contact messages (pagination, status filter) | Yes |
| GET | `/api/admin/contact/stats` | Get message status counts | Yes |
| GET | `/api/admin/contact/:id` | Get single message by ID | Yes |
| PUT | `/api/admin/contact/:id/status` | Update message status | Yes |
| DELETE | `/api/admin/contact/:id` | Delete message | Yes |

**Available Status:** `new`, `read`, `replied`, `archived`

---

## Teachers

Teacher and staff directory with photos and specializations.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/teachers` | List all active teachers (pagination, search, status filter) | No |
| GET | `/api/teachers/statuses` | Get available teacher statuses | No |
| GET | `/api/teachers/:id` | Get single teacher by ID | No |

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search in name/subject
- `status` - Filter by status

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/teachers/stats` | Get teacher status counts | Yes |
| POST | `/api/admin/teachers` | Create new teacher (with photo upload) | Yes |
| PUT | `/api/admin/teachers/:id` | Update teacher (with photo upload) | Yes |
| DELETE | `/api/admin/teachers/:id` | Delete teacher | Yes |

**Available Status:** `active`, `inactive`, `retired`

---

## Facilities

School facilities and infrastructure with condition tracking.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/facilities` | List all facilities (pagination, search, category/condition filter) | No |
| GET | `/api/facilities/categories` | Get available facility categories | No |
| GET | `/api/facilities/conditions` | Get available condition types | No |
| GET | `/api/facilities/:id` | Get single facility by ID | No |

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search in name/description
- `category` - Filter by category
- `condition` - Filter by condition

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/facilities/category-stats` | Get facility counts by category | Yes |
| GET | `/api/admin/facilities/condition-stats` | Get facility counts by condition | Yes |
| POST | `/api/admin/facilities` | Create new facility (with photo upload) | Yes |
| PUT | `/api/admin/facilities/:id` | Update facility (with photo upload) | Yes |
| DELETE | `/api/admin/facilities/:id` | Delete facility | Yes |

**Available Categories:** `classroom`, `laboratory`, `library`, `mosque`, `sport_facility`, `office`, `canteen`, `toilet`, `parking`, `other`  
**Available Conditions:** `good`, `fair`, `poor`, `damaged`

---

## Achievements

School achievements with categorization by type and level.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/achievements` | List all achievements (pagination, search, category/level/year filter) | No |
| GET | `/api/achievements/categories` | Get available achievement categories | No |
| GET | `/api/achievements/levels` | Get available achievement levels | No |
| GET | `/api/achievements/:id` | Get single achievement by ID | No |

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `search` - Search in title/description
- `category` - Filter by category
- `level` - Filter by level
- `year` - Filter by achievement year

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/achievements/category-stats` | Get achievement counts by category | Yes |
| GET | `/api/admin/achievements/level-stats` | Get achievement counts by level | Yes |
| POST | `/api/admin/achievements` | Create new achievement | Yes |
| PUT | `/api/admin/achievements/:id` | Update achievement | Yes |
| DELETE | `/api/admin/achievements/:id` | Delete achievement | Yes |

**Available Categories:** `academic`, `sport`, `art`, `other`  
**Available Levels:** `school`, `district`, `city`, `province`, `national`, `international`

---

## Academic Years

Academic year management with active year tracking.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/academic-years` | List all academic years (ordered DESC) | No |
| GET | `/api/academic-years/active` | Get currently active academic year | No |
| GET | `/api/academic-years/:id` | Get academic year by ID | No |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/academic-years` | Create new academic year | Yes |
| PUT | `/api/admin/academic-years/:id/activate` | Set as active academic year (transaction-based) | Yes |
| DELETE | `/api/admin/academic-years/:id` | Delete academic year (cannot delete active year) | Yes |

**Format:** Academic years use format like "2024/2025"  
**Active Year:** Only one academic year can be active at a time

---

## Students

Student directory with normalized enrollment structure and history tracking.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/students` | List all students (pagination, filters) | No |
| GET | `/api/students/statuses` | Get available student statuses | No |
| GET | `/api/students/:id` | Get single student by ID (includes current enrollment) | No |
| GET | `/api/students/:id/enrollment-history` | Get student's enrollment history across years | No |

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `academic_year` - Filter by academic year (e.g., "2024/2025")
- `grade` - Filter by grade (1-6)
- `status` - Filter by status
- `gender` - Filter by gender

**Example:** `GET /api/students?academic_year=2024/2025&grade=5` - Returns all Grade 5 students in 2024/2025

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/students` | Create new student (with photo upload) | Yes |
| PUT | `/api/admin/students/:id` | Update student (with photo upload) | Yes |
| DELETE | `/api/admin/students/:id` | Delete student | Yes |
| POST | `/api/admin/students/:id/enroll` | Enroll student in class | Yes |
| DELETE | `/api/admin/students/:id/enroll/:class_id` | Unenroll student from class | Yes |

**Available Status:** `active`, `inactive`, `graduated`, `transferred`  
**Database Structure:** Normalized with `academic_years → classes → student_enrollments` for history tracking

---

## Alumni

Alumni directory with public self-registration and admin approval workflow.

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/alumni` | List alumni (public: approved only, admin: all with filters) | Optional |
| GET | `/api/alumni/graduation-years` | Get available graduation years | No |
| GET | `/api/alumni/statuses` | Get available registration statuses | No |
| GET | `/api/alumni/:id` | Get alumni by ID (public: approved only) | Optional |
| POST | `/api/alumni` | Public self-registration (with photo upload, creates with 'pending' status) | No |

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `registration_status` - Filter by status (admin only)
- `graduation_year` - Filter by year
- `gender` - Filter by gender

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/alumni/status-counts` | Get registration status counts | Yes |
| PUT | `/api/admin/alumni/:id` | Update alumni (with photo upload) | Yes |
| PUT | `/api/admin/alumni/:id/status` | Update registration status (approve/reject) | Yes |
| DELETE | `/api/admin/alumni/:id` | Delete alumni | Yes |

**Available Status:** `pending`, `approved`, `rejected`  
**Workflow:** Public registration → pending → admin approves/rejects → public visibility

---

## File Upload Endpoints

All file uploads use `multipart/form-data` encoding.

### Photo/Image Uploads
- **Field Name:** `photo` or `image`
- **Accepted Types:** `.jpg`, `.jpeg`, `.png`
- **Max Size:** 5MB
- **Features:** Automatic duplicate detection via perceptual hash comparison
- **Storage:** `/uploads/{module}/` directory

### Supported Modules with Image Upload
- News: `POST/PUT /api/admin/news` (field: `featured_image`)
- Teachers: `POST/PUT /api/admin/teachers` (field: `photo`)
- Facilities: `POST/PUT /api/admin/facilities` (field: `photo`)
- Photo Galleries: `POST /api/admin/gallery/albums` (cover_photo), `POST /api/admin/gallery/albums/:albumId/photos` (photo)
- Students: `POST/PUT /api/admin/students` (field: `photo`)
- Alumni: `POST /api/alumni` (public), `PUT /api/admin/alumni/:id` (admin) (field: `photo`)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Success with Pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Optional error details"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Environment Variables

Required configuration in `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=mysql
DB_PORT=3306
DB_USER=sdit_user
DB_PASSWORD=sdit_password
DB_NAME=sdit_rohum

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=*
```

---

## Database Schema

### Normalized Structure Highlights

**Student Enrollment System:**
```
academic_years (id, year, is_active)
    ↓ FK
classes (id, grade, academic_year_id)
    ↓ FK
student_enrollments (student_id, class_id)
    ↓ FK
students (nisn, nis, name, ...)
```

This structure allows:
- Track student progression across years
- Filter by academic year and grade efficiently
- Maintain complete enrollment history
- Enforce single active academic year

**Key Relationships:**
- One-to-many: `photo_albums → photos`
- One-to-many: `academic_years → classes`
- Many-to-many: `students ↔ classes` (via `student_enrollments`)

---

## Code Quality Features

### 1. Enum Constants
All database ENUMs exported as constants from `src/constants/` for type safety.

### 2. Dynamic Field Updates
Models use loop pattern with `allowedFields` array to avoid repetitive conditionals.

### 3. Smart Image Handling
Perceptual hash comparison prevents duplicate image uploads across the system.

### 4. Transaction Support
Critical operations (e.g., setting active academic year) use MySQL transactions.

### 5. Middleware Chain
- `authenticateToken` - JWT verification
- `optionalAuth` - Allow both authenticated and public access
- `upload.single()` - Multer file upload middleware

---

## Deployment Notes

1. **Database Migration:** Apply `database/schema.sql` on fresh install
2. **File Uploads:** Ensure `uploads/` directory has write permissions
3. **Environment:** Set `NODE_ENV=production` for production
4. **CORS:** Configure `CORS_ORIGIN` for your frontend domain
5. **JWT Secret:** Use strong random string for `JWT_SECRET`

---

## Module Status

| Module | Status | Routes | Features |
|--------|--------|--------|----------|
| Authentication | ✅ Complete | 3 | JWT, bcrypt, token refresh |
| School Profile | ✅ Complete | 5 | Key-value storage |
| News | ✅ Complete | 6 | Slug, status, categories |
| Videos | ✅ Complete | 6 | YouTube/Vimeo, categories |
| Galleries | ✅ Complete | 6 | Albums, duplicate detection |
| Contact | ✅ Complete | 6 | Form submission, status tracking |
| Teachers | ✅ Complete | 6 | Photo upload, status filter |
| Facilities | ✅ Complete | 8 | Categories, condition tracking |
| Achievements | ✅ Complete | 8 | Categories, levels, year filter |
| Academic Years | ✅ Complete | 6 | Active year management |
| Students | ✅ Complete | 9 | Normalized enrollment, history |
| Alumni | ✅ Complete | 8 | Public registration, approval |
| **Total** | **11/12** | **77** | Downloads skipped |
