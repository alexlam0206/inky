# Inky

Inky is an open-source, student-built e-ink dashboard. It displays your daily tasks, upcoming deadlines, and habit tracking (like study streaks) on a low-power e-ink display.

## Why E-ink?

We chose e-ink for this project because:
*   **Cool**: It is cool, and the temperature is also cool  comparing to a normal monitor.
*   **Low Power**: It only consumes power when updating the image.
*   **Always On**: The dashboard is always visible without emitting light, making it less distracting than a monitor or phone.
*   **Paper-like Reading**: High contrast and readability.


## How it works

Coming Soon.

## Setup and Usage

### Prerequisites
*   Node.js 

### Installation

1.  Clone the repo. yeah.
    ```bash
    git clone https://github.com/yourusername/inky.git
    cd inky
    ```
2.  Install dependencies:
    ```bash
    npm install
    npm install express canvas
    ```

### Running the System

You need to run both the backend server and the frontend UI.

**1. Start the Backend Server**
This runs on port 3001 and handles data storage and image rendering.

```bash
node backend/server.js
```

**2. Start  Admin UI**
On port `3000` , it allows you to manage your dashboard.

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to add tasks or track habits.

## Device Integration

To display the dashboard on your e-ink device:

1.  Ensure your device is on the same network as your computer.
2.  The device should make a HTTP GET request to:
    ```
    http://<YOUR_COMPUTER_IP>:3001/render
    ```
3.  The server responds with a PNG image (800x600 grayscale).
4.  Your device  should download this image and write it to the e-ink display.

### Example Workflow
1.  You finish studying and click "Mark study done today" on the web UI.
2.  The backend updates `data.json`.
3.  Your e-ink device wakes up (e.g., every hour), fetches the new image from `/render`, and updates the screen to show the filled square for today.
