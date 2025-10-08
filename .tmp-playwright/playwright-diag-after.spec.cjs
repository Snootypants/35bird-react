const { test } = require('@playwright/test')

const consoleLogs = []
const failedRequests = []

const captureMarkers = (label, payload) => {
  console.log(`PLAYWRIGHT_${label}_START`)
  console.log(JSON.stringify(payload, null, 2))
  console.log(`PLAYWRIGHT_${label}_END`)
}

test('collect console errors after embed fix', async ({ page }) => {
  const origin = process.env.ASTEROIDS_DEV_ORIGIN ?? 'http://localhost:5181'

  page.on('console', (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() })
  })
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText })
  })

  await page.goto(`${origin}/play/asteroids`, { waitUntil: 'networkidle' })

  const startButton = await page.$('.start-btn')
  if (startButton) {
    await startButton.click()
    await page.waitForTimeout(1000)
  }

  await page.waitForTimeout(2000)

  const { canvasSize, nonBlackPixels } = await page.evaluate(() => {
    const canvas = document.querySelector('.game-canvas')
    if (!canvas) {
      return { canvasSize: null, nonBlackPixels: 0 }
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return { canvasSize: { width: canvas.width, height: canvas.height }, nonBlackPixels: 0 }
    }
    const { width, height } = canvas
    const data = ctx.getImageData(0, 0, width, height).data
    let nonBlack = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      if (a !== 0 && (r !== 0 || g !== 0 || b !== 0)) {
        nonBlack += 1
      }
    }
    return { canvasSize: { width, height }, nonBlackPixels: nonBlack }
  })

  const screenshotPath = '/tmp/asteroids-after.png'
  await page.screenshot({ path: screenshotPath, fullPage: true })

  captureMarkers('CONSOLE_LOGS', consoleLogs)
  captureMarkers('FAILED_REQUESTS', failedRequests.slice(0, 10))
  captureMarkers('SCREENSHOT_META', { screenshotPath, canvasSize, nonBlackPixels })
})
