# Order Service
Processes orders and payments

## Endpoints
- GET /orders — List all orders
- GET /orders/:id — Get order by ID
- POST /orders — Create an order
- PUT /orders/:id — Update an order
- DELETE /orders/:id — Delete an order
- GET /metrics (Prometheus metrics)

See openapi.yaml for full API spec.

### Example Requests

**Create:**
```http
POST /orders
Content-Type: application/json
{
  "userId": "alice",
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

**Get by ID:**
```http
GET /orders/1
```

**Update:**
```http
PUT /orders/1
Content-Type: application/json
{
  "status": "shipped"
}
```

**Delete:**
```http
DELETE /orders/1
```

### Notes
- This service uses in-memory storage for demo/testing. Data will reset on restart.

## Local Development

```bash
npm install
npm run start
```

## Docker

```bash
docker build -t order-service .
docker run -p 3003:3003 order-service
```

## Health Check

- GET /health (returns 200 OK)

## Testing

```bash
npm test
```
