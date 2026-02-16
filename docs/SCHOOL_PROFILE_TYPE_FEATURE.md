# School Profile Type Field - Feature Documentation

## Overview
Added metadata support to the school profile system to distinguish between different field types (text, image, email, phone, url, longtext).

## Database Changes

### Added Column
- **Table**: `school_profile`
- **Column**: `type VARCHAR(50) DEFAULT 'text'`
- **Position**: After `value` column

### Valid Types
- `text` - Short text fields (default)
- `longtext` - Long text fields (descriptions, etc.)
- `email` - Email addresses
- `phone` - Phone numbers
- `url` - Website URLs
- `image` - Image file paths

## API Changes

### 1. GET /api/school-profile
Returns data with metadata about field types.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "school_name": "SDIT Rohum",
    "school_logo": "http://localhost:3000/uploads/photos/logo.png",
    "school_email": "info@sditrohum.com"
  },
  "metadata": {
    "school_name": { "type": "text" },
    "school_logo": { "type": "image" },
    "school_email": { "type": "email" }
  }
}
```

### 2. GET /api/school-profile/:key
Returns individual field with type metadata.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "key": "school_logo",
    "value": "http://localhost:3000/uploads/photos/logo.png",
    "type": "image"
  }
}
```

### 3. POST /api/admin/school-profile
Create new key-value pair with type.

**Request:**
```json
{
  "key": "school_logo",
  "value": "uploads/photos/logo.png",
  "type": "image"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data 'school_logo' berhasil dibuat",
  "data": {
    "key": "school_logo",
    "value": "uploads/photos/logo.png",
    "type": "image"
  }
}
```

**Validation:**
- `key` is required and must be unique
- `value` is required
- `type` must be one of: text, longtext, email, phone, url, image (defaults to 'text')

### 4. PUT /api/admin/school-profile/:key
Update existing key-value pair. Can optionally update type.

**Request (update value only):**
```json
{
  "value": "New School Name"
}
```

**Request (update value and type):**
```json
{
  "value": "uploads/photos/new-logo.png",
  "type": "image"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data 'school_logo' berhasil diupdate",
  "data": {
    "key": "school_logo",
    "value": "uploads/photos/new-logo.png",
    "type": "image"
  }
}
```

### 5. PUT /api/admin/school-profile (Bulk Update)
Update multiple fields at once. Supports both simple values and objects with type.

**Request:**
```json
{
  "school_name": "SDIT Rohmatul Ummah",
  "school_logo": {
    "value": "uploads/photos/logo.png",
    "type": "image"
  },
  "school_email": "info@sditrohum.com"
}
```

**Note:** 
- If you pass a simple value (string), only the value will be updated, type remains unchanged
- If you pass an object with `value` and `type`, both will be updated

### 6. POST /api/admin/school-profile/upload-image (NEW)
Upload an image file for school profile.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Field name: `image`
- File types: JPEG, JPG, PNG, WEBP
- Max size: 5MB

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/admin/school-profile/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/logo.png"
```

**Response:**
```json
{
  "success": true,
  "message": "Image berhasil diupload",
  "data": {
    "url": "http://localhost:3000/uploads/photos/photo-1234567890.png",
    "relativePath": "uploads/photos/photo-1234567890.png",
    "filename": "photo-1234567890.png"
  }
}
```

**Usage Flow:**
1. Upload image using this endpoint
2. Get the `relativePath` from response
3. Create or update school profile field with the `relativePath` and `type: "image"`

```bash
# Step 1: Upload image
curl -X POST http://localhost:3000/api/admin/school-profile/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@logo.png"

# Step 2: Create/update field with the returned path
curl -X POST http://localhost:3000/api/admin/school-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "school_logo",
    "value": "uploads/photos/photo-1234567890.png",
    "type": "image"
  }'
```

## Frontend Implementation Guide

### Detecting Field Types
```javascript
// Fetch school profile
const response = await fetch('/api/school-profile');
const { data, metadata } = await response.json();

// Check field type
if (metadata.school_logo.type === 'image') {
  // Render as image
  return <img src={data.school_logo} alt="School Logo" />;
} else if (metadata.school_email.type === 'email') {
  // Render as email link
  return <a href={`mailto:${data.school_email}`}>{data.school_email}</a>;
} else if (metadata.school_phone.type === 'phone') {
  // Render as phone link
  return <a href={`tel:${data.school_phone}`}>{data.school_phone}</a>;
}
```

### Dynamic Form Rendering
```javascript
const renderField = (key, value, type) => {
  switch (type) {
    case 'image':
      return <ImageUploadField key={key} value={value} />;
    case 'email':
      return <input type="email" key={key} defaultValue={value} />;
    case 'phone':
      return <input type="tel" key={key} defaultValue={value} />;
    case 'url':
      return <input type="url" key={key} defaultValue={value} />;
    case 'longtext':
      return <textarea key={key} defaultValue={value} />;
    default:
      return <input type="text" key={key} defaultValue={value} />;
  }
};
```

## Migration Script
The migration script is located at: `/database/migrations/add_type_to_school_profile.sql`

It automatically detects and sets appropriate types for existing fields based on naming patterns:
- Fields containing "photo", "logo", "image" → `image`
- Fields containing "email" → `email`
- Fields containing "phone", "telepon" → `phone`
- Fields containing "website", "url" → `url`
- All others → `text` (default)

## Backward Compatibility
✅ The `type` column defaults to `'text'`, so existing queries will continue to work.
✅ The GET endpoint maintains backward compatibility by keeping the `data` object structure.
✅ Type metadata is provided separately in the `metadata` object.
✅ Update operations work with or without the `type` parameter.

## Model Changes
- Added `VALID_TYPES` constant with allowed types
- Added `isValidType()` validation method
- Updated all queries to include `type` field
- Added type validation in `create()` and `update()` methods
- Enhanced `updateMultiple()` to support both simple values and objects with type

## Utilities
- Added `getRelativePath()` in `urlHelper.js` to convert absolute paths to relative paths
- Updated image URL transformation to use `type === 'image'` instead of checking for "photo" in key name
