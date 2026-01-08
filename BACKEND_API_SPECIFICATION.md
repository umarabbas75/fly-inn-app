# Backend API Specification for Business Management

## Overview

This document outlines the complete API requirements for business creation, updates, and image management. The frontend expects these endpoints to handle multiple businesses per request, with images uploaded separately after business creation.

---

## 1. Business Creation API

### Endpoint

```
POST /business/create-multiple
```

### Authentication

- **Required**: Yes
- **Method**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <access_token>`

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <access_token>
```

### Request Body Structure

```json
{
  "name": "Skyline Restaurant",
  "tag_line": "The best views in town!",
  "business_details": "A beautiful restaurant with panoramic views...",
  "address": "123 Airport Road",
  "city": "Los Angeles",
  "state": "California",
  "zipcode": "90001",
  "country": "United States",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "airport": "LAX",
  "distance_from_runway": "0.5 miles",
  "url": "https://skyline-restaurant.com",
  "operational_hrs": "Mon-Fri: 9AM-5PM, Sat-Sun: 10AM-6PM",
  "phone": "+1234567890",
  "other_phone": "+1987654321",
  "featured": false,
  "payment_method_id": "pm_1234567890abcdef",
  "price_ids": [
    {
      "price_id": "price_1234567890",
      "type": "aircraft_sales_new"
    },
    {
      "price_id": "price_0987654321",
      "type": "restaurant"
    }
  ],
  "discounts": "[{\"title\":\"Early Bird Special\",\"description\":\"10% off before 5PM\"}]"
}
```

### Field Descriptions

| Field                  | Type    | Required | Validation                               | Description                       |
| ---------------------- | ------- | -------- | ---------------------------------------- | --------------------------------- |
| `name`                 | string  | Yes      | Max 255 chars                            | Business name                     |
| `tag_line`             | string  | Yes      | Max 100 chars                            | Business tagline                  |
| `business_details`     | string  | Yes      | Min 5, Max 1000 chars                    | Business description              |
| `address`              | string  | Yes      | Max 300 chars                            | Street address                    |
| `city`                 | string  | Yes      | Max 50 chars                             | City name                         |
| `state`                | string  | Yes      | Max 50 chars                             | State/Province                    |
| `zipcode`              | string  | Yes      | -                                        | ZIP/Postal code                   |
| `country`              | string  | Yes      | Max 50 chars                             | Country name                      |
| `latitude`             | number  | Yes      | -90 to 90                                | GPS latitude                      |
| `longitude`            | number  | Yes      | -180 to 180                              | GPS longitude                     |
| `airport`              | string  | Yes      | Max 4 chars                              | Airport identifier (e.g., "LAX")  |
| `distance_from_runway` | string  | Yes      | -                                        | Distance from runway              |
| `url`                  | string  | Yes      | Valid URL                                | Website URL                       |
| `operational_hrs`      | string  | Yes      | Max 100 chars                            | Hours of operation                |
| `phone`                | string  | Yes      | Valid phone number                       | Primary phone number              |
| `other_phone`          | string  | No       | Valid phone number, different from phone | Secondary phone number            |
| `featured`             | boolean | No       | Default: false                           | Whether business is featured      |
| `payment_method_id`    | string  | Yes      | -                                        | Stripe payment method ID          |
| `price_ids`            | array   | Yes      | Array of objects                         | Subscription price IDs with types |
| `discounts`            | string  | No       | JSON string                              | JSON array of discount objects    |

### Multiple Business Handling Logic

**IMPORTANT**: The frontend sends a single request with `price_ids` array. The backend must:

1. **Create one business record per `price_ids` entry**
2. Each business should have the same base information (name, address, etc.)
3. Each business should have a different `type` (from `price_ids[].type`)
4. Each business should be linked to its corresponding subscription (`price_ids[].price_id`)

### Response Format (Success)

**Status Code**: `200 OK`

```json
{
  "success": true,
  "status": true,
  "statusCode": 200,
  "message": "Businesses created successfully",
  "data": [
    {
      "business_id": 4,
      "type": "aircraft_sales_new",
      "subscription_id": "sub_1SXpQ4A4ox7ufUXKbt9CBYZZ"
    },
    {
      "business_id": 5,
      "type": "restaurant",
      "subscription_id": "sub_1SXpQ4A4ox7ufUXKbt9CBYZZ"
    }
  ]
}
```

### Response Fields

| Field                    | Type    | Description                                     |
| ------------------------ | ------- | ----------------------------------------------- |
| `success`                | boolean | Operation success flag                          |
| `status`                 | boolean | Status flag                                     |
| `statusCode`             | number  | HTTP status code                                |
| `message`                | string  | Success message                                 |
| `data`                   | array   | Array of created businesses                     |
| `data[].business_id`     | number  | Created business ID (REQUIRED for image upload) |
| `data[].type`            | string  | Business type                                   |
| `data[].subscription_id` | string  | Stripe subscription ID                          |

### Response Format (Error)

**Status Code**: `400 Bad Request` or `500 Internal Server Error`

```json
{
  "success": false,
  "status": false,
  "statusCode": 400,
  "error": "Validation error",
  "message": "Business name is required"
}
```

---

## 2. Business Update API

### Endpoint

```
PUT /business/:id
```

### Authentication

- **Required**: Yes
- **Method**: Bearer Token (JWT)

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <access_token>
```

### Request Body Structure

```json
{
  "name": "Updated Business Name",
  "tag_line": "Updated tagline",
  "business_details": "Updated description...",
  "address": "123 Updated Street",
  "city": "Los Angeles",
  "state": "California",
  "zipcode": "90001",
  "country": "United States",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "airport": "LAX",
  "distance_from_runway": "0.5 miles",
  "url": "https://updated-url.com",
  "operational_hrs": "Mon-Fri: 9AM-5PM",
  "phone": "+1234567890",
  "other_phone": "+1987654321",
  "featured": false,
  "discounts": "[{\"title\":\"New Discount\",\"description\":\"20% off\"}]",
  "remove_images": [1, 2, 3]
}
```

### Field Descriptions

| Field                    | Type  | Required | Description                                |
| ------------------------ | ----- | -------- | ------------------------------------------ |
| All fields from creation | -     | No       | Same as creation (all optional for update) |
| `remove_images`          | array | No       | Array of image IDs to delete               |

### Response Format (Success)

**Status Code**: `200 OK`

```json
{
  "success": true,
  "status": true,
  "statusCode": 200,
  "message": "Business updated successfully",
  "data": {
    "id": 4,
    "name": "Updated Business Name",
    ...
  }
}
```

---

## 3. Business Images Upload API (Create Mode)

### Endpoint

```
POST /business/:id/images
```

### Authentication

- **Required**: Yes
- **Method**: Bearer Token (JWT)

### Request Headers

```
Content-Type: multipart/form-data
Authorization: Bearer <access_token>
```

### Request Body (FormData)

The frontend sends images with metadata in the following format:

#### Photo Images

- `photo_images` (File[]) - Array of image files
- `photo_image_descriptions[0]` (string) - Description for first photo
- `photo_image_descriptions[1]` (string) - Description for second photo
- `photo_image_sort_orders[0]` (number) - Sort order for first photo (0 = featured)
- `photo_image_sort_orders[1]` (number) - Sort order for second photo
- ... (repeated for each photo)

#### Menu Images

- `menu_images` (File[]) - Array of image files
- `menu_image_descriptions[0]` (string) - Description for first menu image
- `menu_image_descriptions[1]` (string) - Description for second menu image
- `menu_image_sort_orders[0]` (number) - Sort order for first menu image
- `menu_image_sort_orders[1]` (number) - Sort order for second menu image
- ... (repeated for each menu image)

#### Logo Image

- `logo_image` (File) - Single logo image file (optional)

### Example FormData Structure

```
photo_images: [File1, File2, File3]
photo_image_descriptions[0]: "Main entrance"
photo_image_descriptions[1]: "Dining area"
photo_image_descriptions[2]: "Outdoor seating"
photo_image_sort_orders[0]: 0
photo_image_sort_orders[1]: 1
photo_image_sort_orders[2]: 2

menu_images: [File4, File5]
menu_image_descriptions[0]: "Breakfast menu"
menu_image_descriptions[1]: "Dinner menu"
menu_image_sort_orders[0]: 0
menu_image_sort_orders[1]: 1

logo_image: File6
```

### Image Requirements

| Image Type   | Max Count | Max File Size | Min Resolution | Allowed Formats      |
| ------------ | --------- | ------------- | -------------- | -------------------- |
| Photo Images | 20        | 15MB          | 800×600px      | JPEG, PNG, WEBP, JPG |
| Menu Images  | 20        | 15MB          | 800×600px      | JPEG, PNG, WEBP, JPG |
| Logo Image   | 1         | 15MB          | -              | JPEG, PNG, WEBP, JPG |

### Sort Order Logic

- **Sort order 0** = Featured image (first image displayed)
- Images should be sorted by `sort_order` ascending
- Each image type (photo/menu) has its own sort order sequence

### Response Format (Success)

**Status Code**: `200 OK`

```json
{
  "success": true,
  "status": true,
  "statusCode": 200,
  "message": "Images uploaded successfully",
  "data": {
    "photo_images": [
      {
        "id": 1,
        "image": "business/4/photos/photo1.jpg",
        "url": "https://s3.amazonaws.com/flyinn-app-bucket/business/4/photos/photo1.jpg",
        "description": "Main entrance",
        "sort_order": 0,
        "type": "photo"
      },
      {
        "id": 2,
        "image": "business/4/photos/photo2.jpg",
        "url": "https://s3.amazonaws.com/flyinn-app-bucket/business/4/photos/photo2.jpg",
        "description": "Dining area",
        "sort_order": 1,
        "type": "photo"
      }
    ],
    "menu_images": [
      {
        "id": 3,
        "image": "business/4/menus/menu1.jpg",
        "url": "https://s3.amazonaws.com/flyinn-app-bucket/business/4/menus/menu1.jpg",
        "description": "Breakfast menu",
        "sort_order": 0,
        "type": "menu"
      }
    ],
    "logo": {
      "id": 4,
      "image": "business/4/logo/logo.jpg",
      "url": "https://s3.amazonaws.com/flyinn-app-bucket/business/4/logo/logo.jpg"
    }
  }
}
```

### Response Fields

| Field                             | Type    | Description                    |
| --------------------------------- | ------- | ------------------------------ |
| `success`                         | boolean | Operation success flag         |
| `status`                          | boolean | Status flag                    |
| `statusCode`                      | number  | HTTP status code               |
| `message`                         | string  | Success message                |
| `data.photo_images[]`             | array   | Array of uploaded photo images |
| `data.photo_images[].id`          | number  | Image ID                       |
| `data.photo_images[].image`       | string  | Relative image path            |
| `data.photo_images[].url`         | string  | Full image URL                 |
| `data.photo_images[].description` | string  | Image description              |
| `data.photo_images[].sort_order`  | number  | Sort order                     |
| `data.photo_images[].type`        | string  | Image type ("photo" or "menu") |
| `data.menu_images[]`              | array   | Array of uploaded menu images  |
| `data.logo`                       | object  | Logo image object              |

---

## 4. Business Images Update API (Edit Mode)

### Endpoint

```
PATCH /business/:id/images
```

### Authentication

- **Required**: Yes
- **Method**: Bearer Token (JWT)

### Request Headers

```
Content-Type: multipart/form-data
Authorization: Bearer <access_token>
```

### Request Body (FormData)

The frontend sends updates in the following format:

#### New Images (to add)

- `new_images` (File[]) - Array of new image files
- `new_image_descriptions[0]` (string) - Description for first new image
- `new_image_descriptions[1]` (string) - Description for second new image
- `new_image_sort_orders[0]` (number) - Sort order for first new image
- `new_image_sort_orders[1]` (number) - Sort order for second new image
- ... (repeated for each new image)

#### Image Updates (existing images)

- `image_updates[0][id]` (number) - Image ID to update
- `image_updates[0][description]` (string) - New description
- `image_updates[0][sort_order]` (number) - New sort order
- `image_updates[1][id]` (number) - Another image ID to update
- `image_updates[1][description]` (string) - New description
- `image_updates[1][sort_order]` (number) - New sort order
- ... (repeated for each updated image)

#### Deleted Images

- `deleted_image_ids[0]` (number) - ID of image to delete
- `deleted_image_ids[1]` (number) - ID of another image to delete
- ... (repeated for each deleted image)

### Example FormData Structure

```
# Adding new images
new_images: [File1, File2]
new_image_descriptions[0]: "New photo 1"
new_image_descriptions[1]: "New photo 2"
new_image_sort_orders[0]: 5
new_image_sort_orders[1]: 6

# Updating existing images
image_updates[0][id]: 10
image_updates[0][description]: "Updated description"
image_updates[0][sort_order]: 2

image_updates[1][id]: 11
image_updates[1][description]: "Another updated description"
image_updates[1][sort_order]: 3

# Deleting images
deleted_image_ids[0]: 20
deleted_image_ids[1]: 21
```

### Response Format (Success)

**Status Code**: `200 OK`

```json
{
  "success": true,
  "status": true,
  "statusCode": 200,
  "message": "Images updated successfully",
  "data": {
    "updated_images": [...],
    "new_images": [...],
    "deleted_count": 2
  }
}
```

---

## 5. Complete Flow Example

### Step 1: Create Businesses

```http
POST /business/create-multiple
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Skyline Restaurant",
  "tag_line": "The best views in town!",
  "business_details": "A beautiful restaurant...",
  "address": "123 Airport Road",
  "city": "Los Angeles",
  "state": "California",
  "zipcode": "90001",
  "country": "United States",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "airport": "LAX",
  "distance_from_runway": "0.5 miles",
  "url": "https://skyline-restaurant.com",
  "operational_hrs": "Mon-Fri: 9AM-5PM",
  "phone": "+1234567890",
  "payment_method_id": "pm_1234567890",
  "price_ids": [
    {"price_id": "price_123", "type": "restaurant"},
    {"price_id": "price_456", "type": "aircraft_sales_new"}
  ],
  "discounts": "[{\"title\":\"Early Bird\",\"description\":\"10% off\"}]"
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    { "business_id": 4, "type": "restaurant", "subscription_id": "sub_123" },
    {
      "business_id": 5,
      "type": "aircraft_sales_new",
      "subscription_id": "sub_456"
    }
  ]
}
```

### Step 2: Upload Images for Each Business

**For business_id = 4:**

```http
POST /business/4/images
Content-Type: multipart/form-data
Authorization: Bearer <token>

photo_images: [File1, File2]
photo_image_descriptions[0]: "Main entrance"
photo_image_descriptions[1]: "Dining area"
photo_image_sort_orders[0]: 0
photo_image_sort_orders[1]: 1

menu_images: [File3]
menu_image_descriptions[0]: "Breakfast menu"
menu_image_sort_orders[0]: 0

logo_image: File4
```

**For business_id = 5:**

```http
POST /business/5/images
Content-Type: multipart/form-data
Authorization: Bearer <token>

photo_images: [File5, File6]
photo_image_descriptions[0]: "Showroom"
photo_image_descriptions[1]: "Aircraft display"
photo_image_sort_orders[0]: 0
photo_image_sort_orders[1]: 1

logo_image: File7
```

---

## 6. Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "status": false,
  "statusCode": 400,
  "error": "Validation error",
  "message": "Detailed error message here"
}
```

### Common Error Codes

| Status Code | Error Type             | Description                  |
| ----------- | ---------------------- | ---------------------------- |
| 400         | Validation Error       | Invalid input data           |
| 401         | Unauthorized           | Missing or invalid token     |
| 403         | Forbidden              | User doesn't have permission |
| 404         | Not Found              | Business not found           |
| 413         | Payload Too Large      | Image file too large         |
| 415         | Unsupported Media Type | Invalid image format         |
| 500         | Server Error           | Internal server error        |

### Validation Error Examples

```json
{
  "success": false,
  "status": false,
  "statusCode": 400,
  "error": "Validation error",
  "message": "Business name is required"
}
```

```json
{
  "success": false,
  "status": false,
  "statusCode": 400,
  "error": "Validation error",
  "message": "Image file size exceeds 15MB limit"
}
```

---

## 7. Important Notes for Backend Implementation

### Multiple Business Creation

1. **One request creates multiple businesses** - Each `price_ids` entry creates a separate business record
2. **Same base data, different types** - All businesses share the same address, contact info, etc., but have different `type` values
3. **Separate subscriptions** - Each business is linked to its own subscription via `subscription_id`
4. **Response must include `business_id`** - The frontend needs `business_id` to upload images

### Image Upload Flow

1. **Images uploaded AFTER business creation** - Frontend waits for `business_id` before uploading images
2. **Separate upload per business** - Each business gets its own image upload request
3. **Metadata included** - Descriptions and sort orders are sent with images
4. **Logo is optional** - Logo image may or may not be present

### Image Storage

1. **Store relative paths** - Return relative paths like `business/{id}/photos/photo1.jpg`
2. **Full URLs in response** - Include full S3 URLs in the response
3. **Organize by type** - Separate folders for photos, menus, and logos
4. **Preserve sort order** - Store and return `sort_order` for proper display

### Sort Order Management

1. **0 = Featured** - First image (sort_order = 0) is the featured image
2. **Sequential ordering** - Sort orders should be sequential (0, 1, 2, 3...)
3. **Per type ordering** - Photo images and menu images have separate sort orders
4. **Update on reorder** - When images are reordered, update sort_order values

### Discounts Format

- Frontend sends `discounts` as a **JSON string**
- Format: `"[{\"title\":\"Discount Name\",\"description\":\"Discount Description\"}]"`
- Backend should parse and store as JSON

---

## 8. Testing Checklist

- [ ] Create single business with one type
- [ ] Create multiple businesses with multiple types
- [ ] Upload photo images with descriptions and sort orders
- [ ] Upload menu images with descriptions and sort orders
- [ ] Upload logo image
- [ ] Update business information
- [ ] Update image descriptions
- [ ] Reorder images (update sort_order)
- [ ] Delete images
- [ ] Add new images to existing business
- [ ] Handle validation errors
- [ ] Handle authentication errors
- [ ] Handle file size errors
- [ ] Handle invalid image format errors

---

## 9. Questions for Backend Team

1. **Image storage**: Where will images be stored? (S3 bucket name, path structure)
2. **Image processing**: Will images be resized/optimized server-side?
3. **Multiple businesses**: Should all businesses share the same images, or each have separate images?
4. **Subscription handling**: How are subscriptions created and linked to businesses?
5. **Error messages**: What format should validation error messages follow?
6. **Image limits**: Are there any additional limits beyond what's specified?
7. **Logo handling**: Should logo be stored separately or as part of photo_images?

---

## Contact

For questions or clarifications, please refer to this document or contact the frontend team.

