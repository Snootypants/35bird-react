const { test } = require('@playwright/test')

test('log dom classes', async ({ page }) => {
  const origin = process.env.ASTEROIDS_DEV_ORIGIN ?? 'http://localhost:5181'
  await page.goto(`${origin}/play/asteroids`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(5000)
  const classes = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).map((el) => ({ tag: el.tagName, className: el.className })).slice(0, 20))
  console.log('DOM_CLASSES_START')
  console.log(JSON.stringify(classes, null, 2))
  console.log('DOM_CLASSES_END')
})
