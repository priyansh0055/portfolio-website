const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Navigating to https://stripe.com...');
    await page.goto('https://stripe.com', { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Waiting slightly for animations...');
    await new Promise(r => setTimeout(r, 2000));

    console.log('Taking full page screenshot...');
    // Ensure the body has a background, often headless pages have transparent body backgrounds
    await page.evaluate(() => {
        document.body.style.background = '#fff';
    });

    await page.screenshot({ path: 'C:\\Users\\priya\\.gemini\\antigravity\\brain\\9ac754d9-50cc-42bf-91df-ae8b01e9f1cd\\stripe_screenshot.png', fullPage: true });
    console.log('Done!');

    await browser.close();
})();
