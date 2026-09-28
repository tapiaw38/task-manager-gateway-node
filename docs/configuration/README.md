# Configuration

Configuration is read from environment variables and, when present, from `.env`.

| Variable                              | Default                   | Description                                              |
| :------------------------------------ | :------------------------ | :------------------------------------------------------- |
| `APP_NAME`                            | `Task Manager Gateway`    | Value returned by `GET /api/info`.                       |
| `APP_VERSION`                         | `1.0.0`                   | Version returned by `GET /api/info`.                     |
| `PORT`                                | `8081`                    | HTTP listening port.                                     |
| `ALLOWED_ORIGINS`                     | `http://localhost:5173`   | Comma-separated browser origins accepted by CORS.        |
| `TASK_SERVICE_URL`                    | `http://localhost:8080`   | Base URL for the Go task service.                        |
| `TASK_SERVICE_TIMEOUT_MS`             | `5000`                    | Maximum duration of a Go service request.                |
| `TASK_SERVICE_AUTHENTICATION_ENABLED` | `false`                   | Enables Cloud Run identity tokens for Go service calls.  |
| `OPENAPI_SPEC_PATH`                   | `docs/specs/openapi.yaml` | Absolute path to the OpenAPI document served by Swagger. |

Example local configuration:

```bash
TASK_SERVICE_URL=http://localhost:8080
ALLOWED_ORIGINS=http://localhost:5173
make run-dev
```

`TASK_SERVICE_URL` is server-side configuration. It is never exposed to the React bundle.
