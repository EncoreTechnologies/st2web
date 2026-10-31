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

import { parse } from 'yaml';
import { test, expect } from './fixtures';

// The designer opens the first Orquesta workflow the StackStorm has. It is only read: the
// tests fail if the page writes anything (autosave is off unless someone turned it on).
test.describe('workflow designer', () => {
  let action;
  let workflow;

  test.beforeAll(async ({ st2 }) => {
    const actions = await st2.get('/actions?include_attributes=ref,name,pack,runner_type,entry_point');
    action = actions.find(a => a.runner_type === 'orquesta');
    test.skip(!action, 'no Orquesta workflow installed');

    workflow = parse(await st2.file(action.pack, `actions/${action.entry_point}`));
  });

  test.beforeEach(async ({ loggedIn: page }) => {
    page.on('request', req => {
      if (req.method() !== 'GET' && new URL(req.url()).pathname.startsWith('/api/')) {
        throw new Error(`the designer sent ${req.method()} ${req.url()}`);
      }
    });

    await page.goto(`/#/action/${action.ref}`);
  });

  test('draws every task of the workflow', async ({ page }) => {
    for (const task of Object.keys(workflow.tasks)) {
      await expect(page.getByText(task, { exact: true }).first()).toBeVisible();
    }
  });

  test('shows the action metadata and its source', async ({ page }) => {
    await expect(page.locator(`input[value="${action.name}"], textarea:text-is("${action.name}")`).first()).toBeVisible();

    await page.click('.icon-code');
    const editor = page.locator('.ace_editor');
    await expect(editor).toBeVisible();
    await expect(editor.locator('.ace_text-layer')).toContainText(`name: ${action.name}`);
    await expect(editor.locator('.ace_text-layer')).toContainText('runner_type: orquesta');
  });
});
