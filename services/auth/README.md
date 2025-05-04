# Auth Service

## Endpoints

### `POST /register`
Register a new user.
- **Body:** `{ "username": "string", "password": "string" }`
- **Responses:**
  - `201 Created`: `{ "message": "User registered" }`
  - `400 Bad Request`: `{ "error": "Username and password required" }`
  - `409 Conflict`: `{ "error": "User already exists" }`

### `POST /login`
Login and receive a JWT.
- **Body:** `{ "username": "string", "password": "string" }`
- **Responses:**
  - `200 OK`: `{ "token": "jwt-token" }`
  - `401 Unauthorized`: `{ "error": "Invalid credentials" }`

### `POST /refresh`
Refresh a JWT.
- **Body:** `{ "token": "jwt-token" }`
- **Responses:**
  - `200 OK`: `{ "token": "new-jwt-token" }`
  - `400 Bad Request`: `{ "error": "Token required" }`
  - `401 Unauthorized`: `{ "error": "Invalid token" }`

## Notes
- This service uses an in-memory user store for demonstration. Users will be lost on restart.
- **Security:** Do not use in-memory storage or hardcoded secrets in production. Move JWT_SECRET to Kubernetes Secrets and use a persistent database for users.
JWT-based authentication microservice

## Endpoints
- POST /login
- POST /register 
- GET /verify
