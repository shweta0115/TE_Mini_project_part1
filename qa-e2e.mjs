export default async function run(page, ui) {
  const rnd = Date.now();
  const email = `ui${rnd}@example.com`;

  // Go to the sign-up page.
  await page.goto('http://localhost:5173/#/signup', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // The form exposes 5 textboxes in order: Full Name, Username, Email, Password, Confirm Password.
  // The password fields have no `type` attribute, so role=textbox may only match
  // the first few — fall back to positional input matching.
  const all = page.locator('input');
  const n = await all.count();
  const pairs = [
    [0, 'UI Test'],
    [1, 'uitest' + rnd],
    [2, email],
    [3, 'TestPass123!'],
    [4, 'TestPass123!'],
  ];
  const filled = [];
  for (const [i, val] of pairs) {
    if (i < n) { await all.nth(i).fill(val); filled.push(val); }
  }

  // Accept the terms checkbox (required).
  const cb = page.getByRole('checkbox').first();
  if (await cb.count()) await cb.check();

  const submit = page.getByRole('button', { name: /create acc|sign up|register/i }).first();
  await submit.click();
  await page.waitForTimeout(6000);

  const token = await page.evaluate(() => localStorage.getItem('pythonquest_access_token'));
  const body = await page.evaluate(() => document.body.innerText);

  return {
    email,
    textboxes: n,
    values: filled,
    tokenStored: !!token,
    tokenPrefix: token ? String(token).slice(0, 6) : null,
    urlAfter: page.url(),
    bodyStart: body.slice(0, 250),
  };
}
