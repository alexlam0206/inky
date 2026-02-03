const express = require('express');
const fs = require('fs');
const path = require('path');
const { renderDashboard } = require('./render');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ok');
});

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

app.get('/render', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const pngBuffer = renderDashboard(data);
  
  res.set('Content-Type', 'image/png');
  res.send(pngBuffer);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
