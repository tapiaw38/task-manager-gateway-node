# Testing

```bash
make test
make test-cover
make typecheck
make lint
```

Vitest covers:

- Task-service integration requests, timeout, unavailable service, invalid response, and forwarded errors.
- Task use cases with injected integration doubles.
- Express controllers with Supertest.
- Request parsing and error handling.

Coverage uses the V8 provider. CI runs format checking, linting, type checking, coverage tests, and a production build on pull requests to `develop` and pushes to `main` or `develop`.
