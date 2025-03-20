# The Circus API Documentation

This document outlines the REST API endpoints for The Circus management system. This is a sample API documentation for demonstration purposes.

## Base URL

All API requests should be made to:

```
https://api.example.com/circus/v1
```

## Authentication

API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

To obtain a token, use the authentication endpoint.

## API Endpoints

### Authentication

#### POST /auth/login

Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "userId": "123456"
}
```

### Shows

#### GET /shows

Returns a list of all shows.

**Query Parameters:**

- `status` (optional): Filter by show status (Scheduled, On Sale, Completed, Planning)
- `venue_id` (optional): Filter by venue ID
- `start_date` (optional): Filter shows starting after this date
- `end_date` (optional): Filter shows ending before this date
- `featured` (optional): Filter for featured shows only (true/false)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of results per page (default: 10)

**Response:**

```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "show_id": 1,
      "title": "Celestial Dreams",
      "type": "Evening Show",
      "venue_id": 3,
      "venue_name": "Modern Arena",
      "start_date": "2025-04-15",
      "end_date": "2025-05-30",
      "duration_hours": 2.5,
      "ticket_price_min": 45.00,
      "ticket_price_max": 120.00,
      "capacity": 1200,
      "status": "Scheduled",
      "featured": true
    },
    // More shows...
  ]
}
```

#### GET /shows/{id}

Returns details for a specific show.

**Response:**

```json
{
  "show_id": 1,
  "title": "Celestial Dreams",
  "type": "Evening Show",
  "description": "Experience the magic of the night sky with spectacular aerial performances.",
  "venue_id": 3,
  "venue_name": "Modern Arena",
  "venue_location": {
    "city": "London",
    "country": "UK",
    "address": "78 Oxford Street"
  },
  "start_date": "2025-04-15",
  "end_date": "2025-05-30",
  "duration_hours": 2.5,
  "ticket_price_min": 45.00,
  "ticket_price_max": 120.00,
  "capacity": 1200,
  "status": "Scheduled",
  "featured": true,
  "performers": [
    {
      "id": 1,
      "name": "Elena Skywalker",
      "specialty": "Aerial Silks",
      "role": "Lead Aerialist"
    },
    // More performers...
  ],
  "showtimes": [
    {
      "date": "2025-04-15",
      "time": "19:30",
      "available_seats": 1200
    },
    // More showtimes...
  ]
}
```

#### POST /shows

Creates a new show.

**Request Body:**

```json
{
  "title": "New Show Title",
  "type": "Evening Show",
  "description": "Show description goes here",
  "venue_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-30",
  "duration_hours": 2.0,
  "ticket_price_min": 40.00,
  "ticket_price_max": 100.00,
  "capacity": 1000,
  "status": "Planning",
  "featured": false
}
```

**Response:**

```json
{
  "show_id": 11,
  "title": "New Show Title",
  "type": "Evening Show",
  "description": "Show description goes here",
  "venue_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-30",
  "duration_hours": 2.0,
  "ticket_price_min": 40.00,
  "ticket_price_max": 100.00,
  "capacity": 1000,
  "status": "Planning",
  "featured": false,
  "created_at": "2025-03-20T15:32:10Z"
}
```

#### PUT /shows/{id}

Updates an existing show.

**Request Body:**

```json
{
  "title": "Updated Show Title",
  "status": "On Sale",
  "featured": true
}
```

**Response:**

```json
{
  "show_id": 11,
  "title": "Updated Show Title",
  "type": "Evening Show",
  "description": "Show description goes here",
  "venue_id": 1,
  "start_date": "2025-06-01",
  "end_date": "2025-06-30",
  "duration_hours": 2.0,
  "ticket_price_min": 40.00,
  "ticket_price_max": 100.00,
  "capacity": 1000,
  "status": "On Sale",
  "featured": true,
  "updated_at": "2025-03-20T16:05:22Z"
}
```

#### DELETE /shows/{id}

Deletes a show.

**Response:**

```json
{
  "message": "Show successfully deleted"
}
```

### Performers

#### GET /performers

Returns a list of all performers.

**Query Parameters:**

- `active` (optional): Filter by active status (true/false)
- `specialty` (optional): Filter by specialty
- `page` (optional): Page number for pagination
- `limit` (optional): Number of results per page (default: 10)

**Response:**

```json
{
  "total": 5,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 1,
      "name": "Elena Skywalker",
      "specialty": "Aerial Silks",
      "experience_years": 12,
      "nationality": "Ukrainian",
      "active": true
    },
    // More performers...
  ]
}
```

#### GET /performers/{id}

Returns details for a specific performer.

**Response:**

```json
{
  "id": 1,
  "name": "Elena Skywalker",
  "specialty": "Aerial Silks",
  "experience_years": 12,
  "nationality": "Ukrainian",
  "age": 29,
  "skills": ["Silks", "Trapeze", "Contortion"],
  "active": true,
  "bio": "Elena began her career as a gymnast before transitioning to circus arts. She has performed with major companies worldwide and specializes in breathtaking aerial choreography.",
  "contact": {
    "email": "elena@example.com",
    "phone": "+380-555-1234",
    "manager": "Circus Management Inc."
  },
  "performances": [
    {
      "show_id": 3,
      "show_title": "Aerial Fantasia",
      "role": "Lead Aerialist",
      "duration_minutes": 15
    },
    // More performances...
  ],
  "images": [
    {
      "url": "https://example.com/performers/elena1.jpg",
      "type": "profile"
    },
    // More images...
  ]
}
```

### Venues

#### GET /venues

Returns a list of all venues.

**Response:**

```json
{
  "total": 5,
  "data": [
    {
      "id": 1,
      "name": "Grand Big Top",
      "location": {
        "city": "New York",
        "country": "USA"
      },
      "capacity": 1500
    },
    // More venues...
  ]
}
```

#### GET /venues/{id}

Returns details for a specific venue.

**Response:**

```json
{
  "id": 1,
  "name": "Grand Big Top",
  "location": {
    "city": "New York",
    "country": "USA",
    "address": "123 Broadway Ave",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "capacity": 1500,
  "features": [
    "Climate controlled",
    "360-degree seating",
    "VIP boxes",
    "Multiple rigging points"
  ],
  "accessibility": {
    "wheelchair_accessible": true,
    "hearing_assistance": true,
    "accessible_restrooms": true
  },
  "contact": {
    "manager": "Jane Smith",
    "email": "jane@grandbigtop.example.com",
    "phone": "+1-555-1234"
  },
  "upcoming_shows": [
    {
      "show_id": 3,
      "title": "Aerial Fantasia",
      "start_date": "2025-05-01",
      "end_date": "2025-05-03"
    },
    // More shows...
  ]
}
```

### Bookings

#### POST /bookings

Creates a new booking.

**Request Body:**

```json
{
  "show_id": 1,
  "date": "2025-04-20",
  "seats": 2,
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "555-1234"
  }
}
```

**Response:**

```json
{
  "booking_id": "BK1234567890",
  "show_id": 1,
  "show_title": "Celestial Dreams",
  "date": "2025-04-20",
  "time": "19:30",
  "seats": 2,
  "venue": "Modern Arena",
  "amount": 150.00,
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "555-1234"
  },
  "created_at": "2025-03-20T16:10:45Z",
  "status": "confirmed",
  "ticket_url": "https://api.example.com/tickets/BK1234567890"
}
```

## Error Handling

All API endpoints follow a standard error response format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": "Show with ID 999 does not exist"
  }
}
```

Common error codes:

- `UNAUTHORIZED`: Authentication failed or token expired
- `FORBIDDEN`: User does not have permission to access the resource
- `RESOURCE_NOT_FOUND`: The requested resource does not exist
- `VALIDATION_ERROR`: Request validation failed
- `INTERNAL_SERVER_ERROR`: An unexpected server error occurred

## Rate Limiting

API requests are rate limited to 100 requests per 15-minute window per API key. Rate limit information is included in the response headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed in the window
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: Time when the current rate limit window resets (Unix timestamp)

## Versioning

The API version is included in the URL path. The current version is `v1`. When breaking changes are introduced, a new version will be released.

## Support

For API support, please contact api-support@circus-example.com.
