# Order Service
Processes orders and payments

## Endpoints
- POST /orders
- GET /orders/:id

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
