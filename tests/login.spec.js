// Copyright 2026 The StackStorm Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { test, expect, dt } from './fixtures';

test.describe('login', () => {
  test('opens on the history page with the login form', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/#\/history$/);
    await expect(page.locator(dt('login'))).toBeVisible();
  });

  test('logs in and shows the history panel', async ({ loggedIn: page }) => {
    await expect(page).toHaveURL(/#\/history$/);
    await expect(page.locator(dt('history_panel'))).toBeVisible();
    await expect(page.locator(dt('login'))).toHaveCount(0);
  });

  test('keeps the form and shows an error for wrong credentials', async ({ page }) => {
    await page.goto('/');
    await page.fill(`${dt('login')} input[name="username"]`, 'nobody');
    await page.fill(`${dt('login')} input[name="password"]`, 'wrong');

    const tokens = page.waitForResponse(res => res.url().endsWith('/auth/tokens'));
    await page.click(`${dt('login')} [type="submit"]`);
    expect((await tokens).status()).toBe(401);

    await expect(page.locator(dt('login'))).toBeVisible();
    await expect(page.locator(dt('history_panel'))).toHaveCount(0);
  });
});
