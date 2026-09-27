# Architecture

The project uses a lightweight hexagonal structure. HTTP controllers are inbound adapters; the task integration is an outbound adapter.

```text
React client
    -> Express routes and controllers
    -> gateway use cases
    -> ITaskIntegration
    -> Go task service
    -> Firestore
```

## Layers

| Layer                        | Responsibility                                                           |
| :--------------------------- | :----------------------------------------------------------------------- |
| `adapters/web`               | Express routes, controllers, Swagger handlers, and request logging.      |
| `usecases/task`              | Public-operation orchestration and output mapping.                       |
| `adapters/integrations/task` | HTTP client for the Go task service.                                     |
| `domain`                     | Public task contracts shared by controllers and use cases.               |
| `platform`                   | Configuration, application context, request parsing, and error handling. |

`ITaskIntegration` is the outbound port. Tests inject an in-memory double, so use cases do not require a running Go service.

## Request flow

```text
POST /api/tasks
    -> create controller validates JSON shape
    -> create use case
    -> task integration sends POST to TASK_SERVICE_URL/api/tasks
    -> Go service persists the task
    -> gateway returns { "data": { ...task } }
```

The integration uses `AbortSignal.timeout`. Go service errors with `{ "code", "message" }` retain their original HTTP status and code. Gateway transport failures use the `gateway:*` catalog.
