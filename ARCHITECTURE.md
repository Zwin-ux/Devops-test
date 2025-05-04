# CloudShop Architecture Documentation

## 1. Overview
CloudShop is a cloud-native e-commerce platform built with a microservices architecture. It demonstrates modern DevOps, observability, and infrastructure-as-code best practices for scalable, maintainable cloud deployments.

## 2. Service Architecture
- **Microservices:** Each core domain (auth, product, cart, order) is a separate Node.js (Express) service, containerized with Docker and orchestrated via Kubernetes.
- **API Contracts:** Each service exposes a REST API, described by an OpenAPI spec (`openapi.yaml`).
- **Service Communication:** Services interact via RESTful HTTP calls. Authentication uses JWT tokens issued by the auth service.
- **Observability:** All services expose `/metrics` (Prometheus), structured logs (Winston), and `/health` endpoints. Centralized monitoring is provided by Prometheus, Grafana, and Loki.

## 3. Naming Conventions
- **Folders:** All lowercase, hyphen-separated (e.g., `order-service`, `docs`)
- **Files:** Lowercase, hyphen-separated for scripts/configs (e.g., `server.js`, `openapi.yaml`), PascalCase for classes if used.
- **Variables:** camelCase for JS variables/functions, UPPER_SNAKE_CASE for environment variables.
- **Endpoints:** RESTful, resource-oriented (e.g., `/products`, `/orders/:id`, `/cart/add`).

## 4. Technical Constraints
- **Runtime:** Node.js 18+ (see `package.json` for details)
- **Containerization:** Docker, single process per container
- **Orchestration:** Kubernetes (EKS-ready), manifests in `/k8s`
- **Infrastructure:** AWS (Terraform for EKS, RDS, S3)
- **Secrets:** Environment variables, migrate to Kubernetes Secrets for production
- **Testing:** Jest and Supertest for unit/integration tests. Minimum: health, auth, and CRUD endpoint coverage per service.
- **CI/CD:** GitHub Actions, GitOps via ArgoCD

## 5. Patterns & Best Practices
- **Logging:** Use Winston for structured logs; include request path, status, and key context.
- **Metrics:** Use `prom-client` to expose `/metrics` endpoint for Prometheus scraping.
- **Health Checks:** `/health` endpoint returns status and service name.
- **API Documentation:** Each service maintains `openapi.yaml` and updates its README with endpoint details.
- **Resettable State:** Services export reset functions for test isolation.
- **Security:** JWT secrets and user data must not be hardcoded; never store plain passwords in production (use hashing and persistent DB).

## 6. Known Issues & Workarounds
- In-memory stores are used for demo/testing; not suitable for production.
- JWT_SECRET is hardcoded for local/dev; must be set via Kubernetes Secrets in production.
- Dockerfiles may require multi-stage builds for optimized images.

## 7. Future Improvements
- Migrate in-memory stores to PostgreSQL (see infra/k8s for DB manifests).
- Add distributed tracing (e.g., OpenTelemetry).
- Expand API endpoints for full CRUD and validation.
- Harden Dockerfiles and manifests for production security.

## 8. References
- [README.md](./README.md)
- [Service OpenAPI Specs](./services/*/openapi.yaml)
- [Kubernetes Manifests](./k8s/)
- [Terraform Infra](./infra/)
