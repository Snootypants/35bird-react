const { test } = require('@playwright/test')

test('log requests', async ({ page }) => {
  const origin = process.env.ASTEROIDS_DEV_ORIGIN ?? 'http://localhost:5181'
  const requests = []
  page.on('requestfinished', (req) => {
    requests.push(req.url())
  })
  page.on('requestfailed', (req) => {
    requests.push(`${req.url()} :: FAILED :: ${req.failure()?.errorText}`)
  })
  await page.goto(`${origin}/play/asteroids`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  console.log('REQUEST_LOG_START')
  console.log(JSON.stringify(requests, null, 2))
  console.log('REQUEST_LOG_END')
})
