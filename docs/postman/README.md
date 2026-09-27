# Postman

Import <a href="./postman/task-manager-gateway.postman_collection.json" download data-no-router>Task Manager Gateway collection</a> into Postman.

Set collection variable `baseUrl` to the running gateway URL:

```text
http://localhost:8081
```

Set `taskId` after creating a task, then use it for completion and deletion requests.

The collection documents Gateway public endpoints only. The Go task service is private and is not called by the browser or Postman in the deployed architecture.
