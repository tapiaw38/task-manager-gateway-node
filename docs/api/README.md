# API

Base URL: `http://localhost:8081`.

| Method   | Endpoint                   | Description                   |
| :------- | :------------------------- | :---------------------------- |
| `GET`    | `/health`                  | Gateway liveness.             |
| `GET`    | `/api/info`                | Gateway application metadata. |
| `GET`    | `/api/tasks`               | List tasks, newest first.     |
| `POST`   | `/api/tasks`               | Create a task.                |
| `PATCH`  | `/api/tasks/{id}/complete` | Change completion status.     |
| `DELETE` | `/api/tasks/{id}`          | Delete a task.                |
| `GET`    | `/api/docs`                | Swagger UI.                   |
| `GET`    | `/api/docs/openapi.yaml`   | OpenAPI 3.0 document.         |

## Create task

```json
{
    "title": "Buy milk",
    "description": "Go to the supermarket"
}
```

Returns `201` with:

```json
{
    "data": {
        "id": "2c8d915b-6398-41e1-8896-396af606623a",
        "title": "Buy milk",
        "description": "Go to the supermarket",
        "completed": false,
        "createdAt": "2026-09-27T10:05:00Z",
        "updatedAt": "2026-09-27T10:05:00Z"
    }
}
```

## Error format

Every error uses:

```json
{ "code": "task:shared:not-found", "message": "task not found" }
```

Go service errors are forwarded unchanged. Gateway failures use `gateway:task-service-unavailable` (`503`), `gateway:task-service-timeout` (`504`), or `gateway:task-service-invalid-response` (`502`).
