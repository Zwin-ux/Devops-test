# Cart Service
Manages user shopping carts

## Endpoints
- GET /cart?userId=... — Get cart for user
- POST /cart/add — Add item to cart
- PUT /cart/update — Update item quantity
- DELETE /cart/remove — Remove item from cart
- DELETE /cart/clear — Clear cart for user
- GET /metrics (Prometheus metrics)

See openapi.yaml for full API spec.

### Example Requests

**Get cart:**
```http
GET /cart?userId=alice
```

**Add item:**
```http
POST /cart/add
Content-Type: application/json
{
  "userId": "alice",
  "productId": 1,
  "quantity": 2
}
```

**Update item:**
```http
PUT /cart/update
Content-Type: application/json
{
  "userId": "alice",
  "productId": 1,
  "quantity": 3
}
```

**Remove item:**
```http
DELETE /cart/remove
Content-Type: application/json
{
  "userId": "alice",
  "productId": 1
}
```

**Clear cart:**
```http
DELETE /cart/clear
Content-Type: application/json
{
  "userId": "alice"
}
```

### Notes
- This service uses in-memory storage keyed by userId for demo/testing. Data will reset on restart.

## Local Development

```bash
npm install
npm run start
```

## Docker

```bash
docker build -t cart-service .
docker run -p 3002:3002 cart-service
```

## Health Check

- GET /health (returns 200 OK)

## Testing

```bash
npm test
```
