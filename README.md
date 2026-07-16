# Small Backend

Simple task management API built with Express.
Stores tasks in a postgres database

## Run instructions

1. Install dependencies and start the server:
   ```bash
   docker compose up -d --build
   ```

2. Open:
   - API base URL: `http://localhost:8080`
   - Swagger docs: `http://localhost:8080/docs`
   - OpenAPI spec: `http://localhost:8080/openapi.json`

## Endpoint table

| Method | Endpoint | Description | Request body |
| --- | --- | --- | --- |
| GET | `/` | Returns API metadata | None |
| GET | `/health` | Returns service health status | None |
| GET | `/tasks` | Returns all tasks | None |
| GET | `/tasks/:id` | Returns a task by ID | None |
| POST | `/tasks` | Creates a new task | `{ "title": "string", "isDone": boolean }` |
| PUT | `/tasks/:id` | Updates an existing task by ID | `{ "title": "string", "isDone": boolean }` |
| DELETE | `/tasks/:id` | Deletes a task by ID | None |
| GET | `/search?query=<text>` | Searches tasks by title | None |
| GET | `/openapi.json` | Returns OpenAPI JSON document | None |
| GET | `/docs` | Returns Swagger UI page | None |

## Test with curl -i
### Terminal input
>  curl -i http://localhost:8080/tasks/1

### Output
```text
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 44
ETag: W/"2c-vz8ETRTb6F1RjtU39SEE5sQnsgA"
Date: Wed, 15 Jul 2026 08:51:02 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"title":"Let me be ","isDone":false}⏎ 
```

# Swagger UI Screenshot
<img src="assets/Screenshot from 2026-07-15 02-53-26.png" width="800">