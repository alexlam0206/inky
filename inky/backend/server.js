const express = require('express');
const fs = require('fs');
const path = require('path');
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
