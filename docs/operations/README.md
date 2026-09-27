# Operations

## Local development

Install dependencies once:

```bash
make install
```

Start the Go task service first, then the gateway:

```bash
cd ../task-manager-service-go
make run
```

```bash
cd ../task-manager-gateway-node
make run-dev
```

Swagger UI runs at `http://localhost:8081/api/docs`. Docsify runs at `http://localhost:3001`:

```bash
make docs
```

## Cloud Run

Cloud Run deployment is intentionally outside the current CI workflow. Future services use `southamerica-east1`.

The gateway is public. The Go task service must remain private. Before deployment, grant the gateway runtime identity `roles/run.invoker` on the Go Cloud Run service and configure authenticated service-to-service calls with an identity token.
