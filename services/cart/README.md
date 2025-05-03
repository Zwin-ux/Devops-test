# Cart Service
Manages user shopping carts

## Endpoints
- GET /cart
- POST /cart/add
- DELETE /cart/remove

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
