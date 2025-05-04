# Product Service
Manages product catalog

## Endpoints
- GET /products — List all products
- GET /products/:id — Get product by ID
- POST /products — Create a product
- PUT /products/:id — Update a product
- DELETE /products/:id — Delete a product
- GET /metrics (Prometheus metrics)

See openapi.yaml for full API spec.

### Example Requests

**Create:**
```http
POST /products
Content-Type: application/json
{
  "name": "New Product",
  "price": 49.99
}
```

**Get by ID:**
```http
GET /products/1
```

**Update:**
```http
PUT /products/1
Content-Type: application/json
{
  "name": "Updated Name",
  "price": 59.99
}
```

**Delete:**
```http
DELETE /products/1
```

### Notes
- This service uses in-memory storage for demo/testing. Data will reset on restart.
