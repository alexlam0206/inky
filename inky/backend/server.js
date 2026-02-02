const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const data = fs.readFileSync(filePath, 'utf8');
  res.json(JSON.parse(data));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
