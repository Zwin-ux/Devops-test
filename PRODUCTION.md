# CloudShop Production Guide

## 1. Building & Running Services Locally

Each microservice (`auth`, `product`, `cart`, `order`) can be run locally:

```bash
cd services/<service>
npm install
npm start
```

Environment variables can be set in a `.env` file (see sample in each service). Secrets are managed via Kubernetes in production.

## 2. Running Services in Docker

```bash
cd services/<service>
docker build -t <service>-service .
docker run -p <port>:<port> <service>-service
```

- Auth: 3000
- Product: 3001
- Cart: 3002
- Order: 3003

## 3. Deploying to Kubernetes

- Manifests are in `/k8s` for each service (deployment, service, probes)
- Use `kubectl apply -f k8s/<service>-deployment.yaml`
- Use `kubectl apply -f k8s/<service>-service.yaml`
- Ingress/NGINX and Istio configs should be applied as needed
- Secrets are stored as Kubernetes Secrets

## 4. CI/CD Pipeline (GitHub Actions)

- On push to `main`, workflow lints, tests, builds, scans, and pushes Docker images
- Images are tagged with commit SHA and pushed to GitHub Container Registry
- Placeholder steps for updating K8s manifests and triggering ArgoCD sync
- See `.github/workflows/deploy.yml`

## 5. Infrastructure as Code (Terraform)

- `/infra` contains Terraform scripts for provisioning EKS, RDS, S3, IAM roles, and networking
- Run `terraform init`, `terraform plan`, `terraform apply` (see infra/README.md)

## 6. Monitoring & Observability

- Prometheus scrapes service and pod metrics
- Grafana dashboards for API latency, errors, business metrics
- Loki collects and centralizes logs (JSON format from winston)
- Alertmanager sends alerts (e.g. to Discord) if healthchecks fail
- Dashboards/configs are in `/dashboards`

## 7. Security Best Practices

- JWT for authentication, secrets in Kubernetes Secrets
- Use non-root user in Docker images
- Run Trivy scans in CI/CD
- Enable Istio mTLS for service-to-service encryption
- Rate limiting via Istio or API Gateway

## 8. Accessing Dashboards & Logs

- Grafana: [http://<grafana-url>](http://<grafana-url>)
- Prometheus: [http://<prometheus-url>](http://<prometheus-url>)
- Loki logs via Grafana Explore

## 9. Troubleshooting & Common Pitfalls

- Check `/health` endpoint for service liveness
- Use `kubectl logs <pod>` for troubleshooting
- Ensure secrets/configs are mounted in K8s
- Watch for pod restarts (resource limits, readiness probe failures)
- Monitor CI/CD logs for failed builds or scans

---

For more details, see the README.md and comments in each directory. For advanced deployment, see Ingress, Istio, and ArgoCD documentation links in the main README.
