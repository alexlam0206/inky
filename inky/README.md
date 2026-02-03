# Inky

Inky is a e-ink dashboard for tracking tasks and habits. It uses a e-ink display to show your daily progress without the distractions of a screen.

## How it works
1.  **Admin UI (React)**: Manage tasks and habits via a web interface.
2.  **Backend (Node.js)**: Stores data in `data.json` and renders a dashboard image.
3.  **Display**: Your e-ink device fetches the rendered image from the server.

## Setup
1.  **Install**:
    ```bash
    npm install
    npm install express canvas
    ```
2.  **Run Backend** (Port 3001):
    ```bash
    node backend/server.js
    ```
3.  **UI** (Port 3000):
    ```bash
    npm start
    ```

## Device Integration
Configure your e-ink device (e.g., Raspberry Pi) to make a GET request to:
`http://<YOUR_IP>:3001/render`

The server returns a **800x600 grayscale PNG** ready to be displayed.
