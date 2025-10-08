const { test } = require('@playwright/test')

test('dump html', async ({ page }) => {
  const origin = process.env.ASTEROIDS_DEV_ORIGIN ?? 'http://localhost:5181'
  await page.goto(`${origin}/play/asteroids`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  const html = await page.content()
  console.log('PAGE_HTML_START')
  console.log(html)
  console.log('PAGE_HTML_END')
})
