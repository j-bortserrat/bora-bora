const { chromium } = require('/Users/javierbortserrat/Projects/borabora-presentacion/node_modules/playwright-core');
const fs = require('fs');

const DIR = '/Users/javierbortserrat/Projects/bora-bora';
const EXEC = '/Users/javierbortserrat/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const tostaPrice = process.argv[2] || '—,—€';   // precio único de las tostas
const html = fs.readFileSync(DIR + '/carta.html', 'utf8').replace(/__TOSTA_PRICE__/g, tostaPrice);
const tmp = DIR + '/.carta_tmp.html';
fs.writeFileSync(tmp, html);

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage();
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.pdf({ path: DIR + '/Carta_BoraBora.pdf', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('✅ PDF generado: Carta_BoraBora.pdf  (precio tostas: ' + tostaPrice + ')');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
