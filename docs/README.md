# Task Manager Gateway

Task Manager Gateway is the public Node.js API for the application. It receives requests from the React client and delegates task operations to the private Go task service.

```text
React web -> Node gateway -> Go task service -> Firestore
```

## Run locally

```bash
make install
make run-dev
```

The gateway listens on `http://localhost:8081`. Swagger UI is available at `http://localhost:8081/api/docs`.

## Public API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/info` | Application metadata. |
| `GET` | `/api/tasks` | List tasks. |
| `POST` | `/api/tasks` | Create a task. |
| `PATCH` | `/api/tasks/{id}/complete` | Change completion status. |
| `DELETE` | `/api/tasks/{id}` | Delete a task. |

## Postman

Import [Task Manager Gateway collection](postman/task-manager-gateway.postman_collection.json) into Postman. Set collection variable `baseUrl` to the running gateway URL.

## Docsify

```bash
make docs
```

The guide runs at `http://localhost:3001`.
