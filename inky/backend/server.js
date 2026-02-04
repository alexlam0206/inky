const express = require('express');
const fs = require('fs');
const path = require('path');
const { renderDashboard } = require('./render');

const app = express();
const port = 3001;

app.use(express.json());

// Serve static files from react app /build folder
app.use(express.static(path.join(__dirname, '../build')));

// API Route
app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const data = fs.readFileSync(filePath, 'utf8');
  res.json(JSON.parse(data));
});

app.post('/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const newData = req.body;
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
  res.json({ success: true });
});

app.get('/render', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const pngBuffer = await renderDashboard(data);
    res.set('Content-Type', 'image/png');
    res.send(pngBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rendering dashboard');
  }
});

// return index.html for any other request
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log(`Inky server running at http://localhost:${port}`);
});
