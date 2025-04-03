const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors({
 origin:'*',
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(express.static(path.join(__dirname, "/")));

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});
app.get('/take-screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(`http://localhost:{PORT}/index.html`, { waitUntil: 'networkidle2' }); 
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
