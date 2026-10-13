# Dabbawala

A full-stack FastAPI project for managing daily meal orders from a kitchen or delivery desk. It combines a responsive order dashboard with a SQLite-backed API so users can create orders, track delivery status, and keep the dabbawala workflow organized in one place.

## How it works

1. A customer order is created from the order desk.
2. The app stores the order in SQLite using SQLModel.
3. The dashboard groups recent orders by status: preparing, picked up, in transit, and delivered.
4. Staff can search, filter, and refresh the table to monitor the queue in real time.
5. The backend exposes the same data through API routes for future integrations or admin tooling.

## Product preview

<div align="center">
  <img src="./Screenshots%20and%20Demo%20Videos/Frontend%20Screenshot%201.png" alt="Dabbawala frontend dashboard" width="900" />
  <br /><br />
  <img src="./Screenshots%20and%20Demo%20Videos/Frontend%20Screenshot%202.png" alt="Dabbawala order form and recent orders table" width="900" />
  <br /><br />
  <img src="./Screenshots%20and%20Demo%20Videos/Backend%20Screenshot%203.png" alt="Dabbawala backend and API flow" width="900" />
</div>

## Demo videos

GitHub does not play `<video>` tags embedded in a repository README. Click a preview below to open the MP4 file:

[![Watch the Dabbawala app demo](./Screenshots%20and%20Demo%20Videos/Frontend%20Screenshot%201.png)](./Screenshots%20and%20Demo%20Videos/Dabbawala%20demo%20video.mp4)

[Watch the Dabbawala app demo video](./Screenshots%20and%20Demo%20Videos/Dabbawala%20demo%20video.mp4)

[![Watch the Dabbawala backend demo](./Screenshots%20and%20Demo%20Videos/Backend%20Screenshot%203.png)](./Screenshots%20and%20Demo%20Videos/Dabbawala%20backend%20demo%20video.mp4)

[Watch the Dabbawala backend demo video](./Screenshots%20and%20Demo%20Videos/Dabbawala%20backend%20demo%20video.mp4)

## Key features

- Responsive order desk UI for daily dabbawala operations
- Create new orders with customer name, address, and meal items
- Filter by delivery status and search by customer, address, or meal name
- Summary cards for total active orders and queue breakdown
- SQLite persistence with SQLModel and FastAPI
- Built-in health check and stats endpoints
- Ready for local deployment and Render hosting

## Tech stack

- Python
- FastAPI
- SQLModel
- SQLite
- HTML, CSS, JavaScript

## Run locally

From the project directory, activate the virtual environment and start the app:

```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open:

- `http://127.0.0.1:8000` for the order desk
- `http://127.0.0.1:8000/docs` for the API documentation

The app creates the SQLite database automatically as `dabbawala.db` in the project root.

## API overview

### Orders

- POST /orders/ - create a new order
- GET /orders/ - list orders with optional filters
- GET /health - health check endpoint

### Stats

- GET /stats/daily - daily summary by order status

## Deployment on Render

1. Push this project to a GitHub repository.
2. In Render, choose New -> Blueprint and connect the repository.
3. Review the `dabbawala` web service and apply the Blueprint.
4. Open the service URL after the first deployment succeeds.

The project includes a Render blueprint that installs dependencies, runs the FastAPI app with Uvicorn, and uses a persistent disk for the SQLite database.

## Project structure

```text
Dabbawala Project/
+-- main.py
+-- database.py
+-- models.py
+-- dabbawala.db
+-- requirements.txt
+-- render.yaml
+-- routes/
|   +-- orders.py
|   +-- stats.py
+-- static/
|   +-- index.html
|   +-- styles.css
|   +-- app.js
+-- Screenshots and Demo Videos/
|   +-- Frontend Screenshot 1.png
|   +-- Frontend Screenshot 2.png
|   +-- Backend Screenshot 3.png
|   +-- Dabbawala demo video.mp4
|   +-- Dabbawala backend demo video.mp4
+-- README.md
```

## License

This project is for educational and demonstration purposes.