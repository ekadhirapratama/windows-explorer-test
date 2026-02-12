import { test, expect } from '@playwright/test';

test.describe('Windows Explorer E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Assuming the app runs on localhost:5173
        await page.goto('http://localhost:5173');
    });

    test('loads the application', async ({ page }) => {
        await expect(page).toHaveTitle(/Windows Explorer/i);
        await expect(page.locator('.sidebar')).toBeVisible();
        await expect(page.locator('.content-panel')).toBeVisible();
    });

    test('displays root folders in sidebar', async ({ page }) => {
        // Check for common root folders like "Local Disk (C:)" or "This PC"
        // Adjust selector based on actual implementation
        const treeNode = page.locator('.folder-tree-node__name').first();
        await expect(treeNode).toBeVisible();
    });

    test('navigates to folder on click', async ({ page }) => {
        // Click on a folder in tree
        const firstFolder = page.locator('.folder-tree-node__item').first();
        await firstFolder.click();

        // Check if content panel updates (might show "This folder is empty" or items)
        // Also check breadcrumb
        await expect(page.locator('.breadcrumb')).toBeVisible();
    });

    test('global search works', async ({ page }) => {
        const searchInput = page.locator('.global-search__input');
        await searchInput.fill('test');

        // Wait for debounce and results
        await expect(page.locator('.content-panel__search-indicator')).toContainText('Searching for "test"');
    });
});
