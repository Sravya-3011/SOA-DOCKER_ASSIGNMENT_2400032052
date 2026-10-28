# Serene Yoga Session Frontend

React + Vite yoga session interface with five navigation pages: Home, Sessions, Add Session, Learning Levels, and About. It includes yoga photography, session cards, Beginner / Intermediate / Advanced level selection, session filtering, and CRUD actions.

## Run locally on Windows

Open PowerShell or CMD:

```bash
cd D:\Projects\YogaSessionProject\frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Backend connection

The frontend calls the Spring Boot backend at `http://localhost:8001` by default.

- `GET /displayAll`
- `POST /addYogaSession`
- `GET /displayById/{id}` (available in the backend; not required for the current screen)
- `PUT /update/{id}`
- `DELETE /delete/{id}`

The frontend sends the backend fields already discussed: `sessionName`, `instructor`, `duration`, `sessionDate`, and `availableSlots`.

**Important about session level:** The backend fields available in the prior discussion did not include `level`. To avoid breaking the existing API, the frontend keeps the selected level in this browser's local storage and does not send an unknown `level` field to Spring Boot. To save levels in PostgreSQL and share them across browsers, add a `level` property to the Java entity/DTO and database mapping, then include `level` in the POST/PUT request payload.

If the browser reports a CORS error, allow the frontend origin `http://localhost:5173` in your Spring Boot backend. The API must be running on port `8001` and PostgreSQL must be available to the backend.

To change the API base URL, create `.env` from `.env.example` and set `VITE_API_URL=http://localhost:8001`, then restart Vite.

## Docker

Make sure Docker Desktop is running and its Linux engine is ready:

```bash
docker build -t yoga-session-frontend:latest .
docker run --rm -p 5173:80 yoga-session-frontend:latest
```

Open `http://localhost:5173`. The Docker image serves the built site with Nginx. Since API calls run in the browser, `localhost:8001` refers to the computer running the browser; keep the backend reachable at that address or change `VITE_API_URL` before building.
