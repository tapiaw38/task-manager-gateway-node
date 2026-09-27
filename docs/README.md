# Introduction

Task Manager Gateway is the public Node.js API for the Task Manager application. It receives requests from the React client, validates public HTTP input, and delegates task operations to the private Go task service.

```text
React web -> Node gateway -> Go task service -> Firestore
```

The gateway does not own task business rules or persistence. The Go service owns validation, task lifecycle, and Firestore access.

## Responsibilities

- Expose the public REST API.
- Apply CORS and request parsing.
- Forward task requests to the Go service with a timeout.
- Preserve structured errors returned by the Go service.
- Return gateway-specific errors when the task service is unavailable, times out, or returns invalid JSON.

## Run locally

```bash
make install
make run-dev
```

The gateway listens on `http://localhost:8081`. Swagger UI is available at `http://localhost:8081/api/docs`.

The gateway listens on `http://localhost:8081`. Swagger UI is available at `http://localhost:8081/api/docs`.

## Public API

| Method   | Endpoint                   | Description               |
| :------- | :------------------------- | :------------------------ |
| `GET`    | `/api/info`                | Application metadata.     |
| `GET`    | `/api/tasks`               | List tasks.               |
| `POST`   | `/api/tasks`               | Create a task.            |
| `PATCH`  | `/api/tasks/{id}/complete` | Change completion status. |
| `DELETE` | `/api/tasks/{id}`          | Delete a task.            |

## Docsify

```bash
make docs
```

The guide runs at `http://localhost:3001`.
