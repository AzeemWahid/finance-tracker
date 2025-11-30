const { chromium } = require('playwright');

async function debugFrontend() {
  console.log('🚀 Launching browser to debug frontend...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      console.log(`❌ CONSOLE ERROR: ${text}`);
    } else if (type === 'warning') {
      console.log(`⚠️  CONSOLE WARNING: ${text}`);
    } else if (type === 'log') {
      console.log(`📝 CONSOLE LOG: ${text}`);
    } else {
      console.log(`🔍 CONSOLE ${type.toUpperCase()}: ${text}`);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log(`\n💥 PAGE ERROR (Uncaught Exception):`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.log(`\n🚫 REQUEST FAILED:`);
    console.log(`   URL: ${request.url()}`);
    console.log(`   Failure: ${request.failure()?.errorText}`);
  });

  // Capture response errors (4xx, 5xx)
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`\n⛔ HTTP ERROR:`);
      console.log(`   URL: ${response.url()}`);
      console.log(`   Status: ${response.status()} ${response.statusText()}`);
    }
  });

  try {
    console.log('📡 Navigating to http://localhost:5174...\n');

    await page.goto('http://localhost:5174', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('\n✅ Page loaded successfully!');

    // Wait a bit to capture any delayed console messages
    await page.waitForTimeout(2000);

    // Check what's actually rendered
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    const appDiv = await page.evaluate(() => document.querySelector('#app')?.innerHTML || 'NOT FOUND');

    console.log('\n📄 Page Content:');
    console.log('─'.repeat(50));
    console.log(`Body has content: ${bodyHTML.length > 0 ? 'YES' : 'NO'}`);
    console.log(`#app div content: ${appDiv.substring(0, 200)}${appDiv.length > 200 ? '...' : ''}`);
    console.log('─'.repeat(50));

    // Take a screenshot
    await page.screenshot({ path: 'e2e/debug-screenshot.png', fullPage: true });
    console.log('\n📸 Screenshot saved to: e2e/debug-screenshot.png');

    // Keep browser open for 30 seconds so we can see what's happening
    console.log('\n⏳ Keeping browser open for 30 seconds to observe...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ ERROR during navigation:');
    console.error(error);
  } finally {
    await browser.close();
    console.log('\n✅ Browser closed. Debug complete!');
  }
}

debugFrontend().catch(console.error);
