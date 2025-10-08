const { test } = require('@playwright/test')

const consoleLogs = []
const failedRequests = []

test('collect console errors', async ({ page }) => {
  page.on('console', (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() })
  })
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText })
  })
  await page.goto('http://127.0.0.1:5175/play/asteroids', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  console.log('PLAYWRIGHT_CONSOLE_LOGS_START')
  console.log(JSON.stringify(consoleLogs, null, 2))
  console.log('PLAYWRIGHT_CONSOLE_LOGS_END')
  console.log('PLAYWRIGHT_FAILED_REQUESTS_START')
  console.log(JSON.stringify(failedRequests.slice(0, 10), null, 2))
  console.log('PLAYWRIGHT_FAILED_REQUESTS_END')
})
