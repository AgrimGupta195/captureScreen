const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/take-screenshot', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:'/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="screenshot.png"'
    });
    res.send(screenshot);
  } catch (error) {
    console.error('❌ Error capturing screenshot:', error);
    res.status(500).json({ error: 'Screenshot failed', details: error.message });
  }
});
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
