const puppeteer = require('puppeteer');

async function scrapeParkingAvailability() {
  let browser = null;
  try {
    // Launch the browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Create a new page
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://www.airport.kr/ap_ko/965/subview.do', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Extract text from .num-txt elements
    const numTxtTexts = await page.evaluate(() => {
      const elements = document.querySelectorAll('.num-txt');
      return Array.from(elements).map((el) => el.textContent.trim());
    });

    // Print the extracted texts
    console.log('Parking Availability Texts:');
    numTxtTexts.forEach((text, index) => {
      console.log(`${index + 1}. ${text}`);
    });

    return numTxtTexts;
  } catch (error) {
    console.error('Error scraping parking availability:', error);
    return [`Scraping failed: ${error.message}`];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the scraping function
scrapeParkingAvailability();

module.exports = {
  scrapeParkingAvailability,
};
