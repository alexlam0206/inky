const express = require('express');
const fs = require('fs');
const path = require('path');
const { renderDashboard } = require('./render');
const app = express();
const port = 3001;

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
