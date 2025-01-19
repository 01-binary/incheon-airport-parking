const puppeteer = require('puppeteer');

const DATA_ARRAY = [
  {
    title: '제1 단기주차장',
    address: 'https://www.airport.kr/ap_ko/964/subview.do',
  },
  {
    title: '제1 장기주차장',
    address: 'https://www.airport.kr/ap_ko/965/subview.do',
  },
  {
    title: '제2 단기주차장',
    address: 'https://www.airport.kr/ap_ko/967/subview.do',
  },
  {
    title: '제2 장기주차장',
    address: 'https://www.airport.kr/ap_ko/968/subview.do',
  },
];

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

    const result = [];
    // Navigate to the website

    for (let i = 0; i < DATA_ARRAY.length; i++) {
      await page.goto(DATA_ARRAY[i].address, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Extract text from span and strong tags within .num-txt elements
      const numTxtTexts = await page.evaluate(() => {
        const elements = document.querySelectorAll('.num-txt');
        return Array.from(elements)
          .map((el) => {
            const spanText = el.querySelector('span')?.textContent.trim() || '';
            const strongText =
              el.querySelector('strong')?.textContent.trim() || '';

            // Combine span and strong text if both exist
            return spanText && strongText
              ? `${spanText} : ${strongText}`
              : spanText || strongText;
          })
          .filter((text) => text !== '');
      });

      result.push({
        title: DATA_ARRAY[i].title,
        texts: numTxtTexts,
      });
    }

    // Format result for easy reading
    const formattedResult = result
      .map((item) => `${item.title}:\n${item.texts.join('\n')}`)
      .join('\n\n');

    console.log(formattedResult);
    return formattedResult;
  } catch (error) {
    console.error('Error scraping parking availability:', error);
    return [`Scraping failed: ${error.message}`];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

(async () => {
  await scrapeParkingAvailability();
})();
