const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const url = 'https://stitch.withgoogle.com/preview/4276611718169263629?node-id=e967a3b4e7d54d4aaa1b79616f666702';
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Waiting slightly for React to render...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('Taking full page screenshot and extracting HTML...');

    // Extract fully rendered HTML
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync('stitch_dom.html', html);

    await page.screenshot({ path: 'stitch_screenshot.png', fullPage: true });
    console.log('Saved stitch_dom.html and stitch_screenshot.png');

    await browser.close();
})();
