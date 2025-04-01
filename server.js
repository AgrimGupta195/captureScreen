const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.get('/take-screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto('http://localhost:5500/index.html', { waitUntil: 'networkidle2' }); 
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();
    res.type('image/png');
    res.send(screenshot);
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    res.status(500).send('Screenshot failed');
  }
});
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
