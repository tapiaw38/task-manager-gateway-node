# Task Manager Gateway (Node)

Public API of the Task Manager application. It is the only entry point for the
web client and it orchestrates the [Go task service](../task-manager-service-go),
which owns the business rules and the persistence.

```bash
React web  ──►  Node gateway  ──►  Go task service  ──►  Firestore / JSON file
```

The gateway has no database of its own. Where a regular service would have
repositories, this one has **integrations**: HTTP clients that talk to the task
service.

## Requirements

- Node.js 20+
- pnpm (the repository uses a pnpm lockfile)
- The Go task service reachable at `TASK_SERVICE_URL`

## Run locally with Make

```bash
cd /home/tapia/Workspace/gaspi/task-manager-gateway-node
make install
make run-dev
```

The gateway listens on `http://localhost:8081` and expects the task service on
`http://localhost:8080`.

To run the whole stack locally, start the task service first:

```bash
cd ../task-manager-service-go && make run
cd ../task-manager-gateway-node && make run-dev
cd ../task-manager-web-react && pnpm dev
```

### Available commands

```bash
make install
make run
make run-dev
make test
make test-cover
make build
make typecheck
make lint
make format-check
```

## Configuration

Variables are read from the environment and, when present, from a `.env` file.
See `.env.example`.

| Variable                  | Default                   | Description                                |
| :------------------------ | :------------------------ | :----------------------------------------- |
| `APP_NAME`                | `Task Manager Gateway`    | Name returned by `GET /api/info`           |
| `APP_VERSION`             | `1.0.0`                   | Version returned by `GET /api/info`        |
| `PORT`                    | `8081`                    | HTTP port                                  |
| `ALLOWED_ORIGINS`         | `http://localhost:5173`   | Comma separated CORS origins               |
| `TASK_SERVICE_URL`        | `http://localhost:8080`   | Base URL of the Go task service            |
| `TASK_SERVICE_TIMEOUT_MS` | `5000`                    | Timeout for every call to the task service |
| `OPENAPI_SPEC_PATH`       | `docs/specs/openapi.yaml` | Specification served at `/api/docs`        |

## Endpoints

Base URL: `http://localhost:8081`

| Method   | Route                      | Description                         |
| :------- | :------------------------- | :---------------------------------- |
| `GET`    | `/health`                  | Liveness; does not call Go          |
| `GET`    | `/api/info`                | Application name and version        |
| `GET`    | `/api/tasks`               | List every task, newest first       |
| `POST`   | `/api/tasks`               | Create a task                       |
| `PATCH`  | `/api/tasks/{id}/complete` | Mark a task as completed or pending |
| `DELETE` | `/api/tasks/{id}`          | Delete a task                       |
| `GET`    | `/api/docs`                | Swagger UI                          |
| `GET`    | `/api/docs/openapi.yaml`   | OpenAPI 3.0 specification           |

`GET /health` answers without reaching the task service and is the Cloud Run
liveness endpoint. `GET /api/info` returns application metadata.

<details>
<summary>Request examples</summary>

```bash
curl http://localhost:8081/api/tasks

curl -X POST http://localhost:8081/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Buy milk","description":"Go to the supermarket"}'

curl -X PATCH http://localhost:8081/api/tasks/{id}/complete \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'

curl -X DELETE http://localhost:8081/api/tasks/{id}
```

</details>

## Error handling

Every error shares the same shape:

```json
{ "code": "task:shared:not-found", "message": "task not found" }
```

Errors raised by the task service are **forwarded with their original code and
status**, instead of being re-mapped. A client therefore relies on one stable set
of codes and does not need to know how many hops sit behind the gateway.

Failures of the gateway itself use their own prefix:

| Code                                    | Status | When                                               |
| :-------------------------------------- | :----- | :------------------------------------------------- |
| `gateway:task-service-unavailable`      | `503`  | The task service is unreachable                    |
| `gateway:task-service-timeout`          | `504`  | It did not answer within `TASK_SERVICE_TIMEOUT_MS` |
| `gateway:task-service-invalid-response` | `502`  | It answered something the gateway could not read   |
| `common:request-body-parsing-error`     | `400`  | Malformed body or wrong field types                |
| `common:not-found`                      | `404`  | Unknown route                                      |
| `common:internal-server-error`          | `500`  | Anything unexpected                                |

Every call to the task service is bounded by `AbortSignal.timeout`, so a hung
service cannot hang the gateway.

## Architecture

```bash
src/
  server.ts                  wiring, middlewares and graceful shutdown

  domain/task.ts             shared types (the gateway owns no business rules)

  platform/
    config/                  configuration read from the environment
    errors/                  ApplicationError, structured logging and the error catalog
    appcontext/              context factory injected into the use cases
    web/                     error handler and request parsing helpers

  adapters/
    integrations/
      integrations.ts        factory
      task/                  ITaskIntegration and one file per operation
    web/
      routes/
      middlewares/logging.ts method, path, status and duration
      controllers/{task,health,info,docs}

  usecases/task/             list, create, complete, delete
```

A request flows `controller → use case → integration → task service`. The
controller validates the payload shape and delegates. The use case orchestrates
and maps the response to the public contract through `toTaskOutputData`, so the
gateway's API does not leak whatever shape the task service returns.

`ITaskIntegration` is an interface, so the use case tests inject a double and
never need a running task service.

## Tests

```bash
make test
make test-cover
```

Integrations are tested with a mocked `fetch`, covering the forwarding of task
service errors and the three gateway failure modes. Use cases are tested against
a double of the integration. Controllers are tested with supertest against a
minimal Express app.

## Deployment

The challenge gateway was deployed manually through the Google Cloud Console.
Cloud Build builds the root `Dockerfile` from the `main` branch and deploys the
resulting image to the `task-manager-gateway-node` Cloud Run service in
`southamerica-east1`.

Configure these runtime variables in Cloud Run:

```text
NODE_ENV=production
TASK_SERVICE_URL=https://GO_SERVICE_URL
TASK_SERVICE_TIMEOUT_MS=5000
ALLOWED_ORIGINS=https://FIREBASE_HOSTING_URL
```

Cloud Run provides `PORT`; do not configure it manually. `TASK_SERVICE_URL`
must be the deployed Go service URL and `ALLOWED_ORIGINS` must be the Firebase
Hosting origin, without a trailing slash.

After a successful deployment, verify liveness without calling the Go service:

```bash
curl https://SERVICE_URL/health
```

Expected response:

```json
{ "status": "ok" }
```

## Documentation

| Resource      | How to open it                                                     |
| :------------ | :----------------------------------------------------------------- |
| Swagger UI    | `make run-dev` then `http://localhost:8081/api/docs`               |
| OpenAPI spec  | `docs/specs/openapi.yaml`                                          |
| Postman       | Import `docs/postman/task-manager-gateway.postman_collection.json` |
| Docsify guide | `make docs` then `http://localhost:3001`                           |

Swagger UI is served from the `swagger-ui-express` assets bundled with the
application, so the documentation works without internet access.

The Postman collection is versioned in `docs/postman/task-manager-gateway.postman_collection.json`. Import it into Postman and set `baseUrl` to the running gateway URL. The collection documents only public Gateway endpoints; the Go service remains private.
