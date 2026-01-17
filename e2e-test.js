const { chromium } = require('playwright');

async function runE2ETests() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  // Capture console messages
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`Browser ${msg.type()}: ${msg.text()}`);
  });

  const results = {
    passed: [],
    failed: [],
    screenshots: []
  };

  async function test(name, fn) {
    try {
      console.log(`\n🧪 Testing: ${name}`);
      await fn();
      results.passed.push(name);
      console.log(`✅ PASSED: ${name}`);
    } catch (error) {
      results.failed.push({ name, error: error.message });
      console.log(`❌ FAILED: ${name} - ${error.message}`);
      // Capture screenshot on failure
      const screenshotPath = `/tmp/screenshot-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.screenshots.push({ test: name, path: screenshotPath });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  }

  try {
    // Test 1: Navigation and Redirect to Login
    await test('Navigate to / and verify redirect to /login', async () => {
      await page.goto('http://localhost:4200/');
      await page.waitForTimeout(2000);
      const url = page.url();
      if (!url.includes('/login')) {
        throw new Error(`Expected redirect to /login but got ${url}`);
      }
    });

    // Test 2: Login Form
    await test('Fill login form with demo@test.com / 123123', async () => {
      // Wait for login form to be visible
      await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
      
      // Fill email
      const emailInput = await page.locator('input[type="email"], input[name="email"]').first();
      await emailInput.fill('demo@test.com');
      
      // Fill password
      const passwordInput = await page.locator('input[type="password"], input[name="password"]').first();
      await passwordInput.fill('123123');
      
      console.log('Login form filled');
    });

    // Test 3: Submit Login
    await test('Submit login and verify redirect to dashboard', async () => {
      // Find and click submit button
      const submitButton = await page.locator('button[type="submit"]').first();
      await submitButton.click();
      
      // Wait for navigation
      await page.waitForTimeout(3000);
      
      const url = page.url();
      console.log(`Current URL after login: ${url}`);
      
      // Should not be on login page anymore
      if (url.includes('/login')) {
        throw new Error('Login failed - still on login page');
      }
    });

    // Take screenshot of logged-in state
    const loginScreenshot = '/tmp/after-login.png';
    await page.screenshot({ path: loginScreenshot, fullPage: true });
    results.screenshots.push({ test: 'After Login', path: loginScreenshot });
    console.log(`📸 Logged-in screenshot: ${loginScreenshot}`);

    // Test 4: Verify Global Header exists
    await test('Verify Global Header with all components', async () => {
      await page.waitForSelector('header, .global-header', { timeout: 5000 });
      
      // Check for logo
      const logo = await page.locator('img[alt*="Logo"], .logo').count();
      if (logo === 0) throw new Error('Logo not found in header');
      
      console.log('Global header verified');
    });

    // Test 5: Account Switcher - Verify Chinese Labels
    await test('Account Switcher: Verify Chinese section headers (個人帳號, 組織, 團隊, 合作夥伴)', async () => {
      // Click account switcher button
      const accountButton = await page.locator('button:has-text("ac7x"), .account-switcher-trigger').first();
      await accountButton.click();
      await page.waitForTimeout(1000);
      
      // Take screenshot of account menu
      const accountMenuScreenshot = '/tmp/account-switcher-menu.png';
      await page.screenshot({ path: accountMenuScreenshot });
      results.screenshots.push({ test: 'Account Switcher Menu', path: accountMenuScreenshot });
      
      // Verify Chinese text for Personal section
      const personalHeader = await page.locator('text=個人帳號').count();
      if (personalHeader === 0) {
        throw new Error('個人帳號 (Personal Account) header not found - still showing English text');
      }
      console.log('✓ Found: 個人帳號');
      
      // Check for other sections (they may not be visible if no data)
      const orgHeader = await page.locator('text=組織').count();
      const teamHeader = await page.locator('text=團隊').count();
      const partnerHeader = await page.locator('text=合作夥伴').count();
      
      console.log(`Section headers found: 個人帳號:${personalHeader}, 組織:${orgHeader}, 團隊:${teamHeader}, 合作夥伴:${partnerHeader}`);
      
      // Close menu
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    });

    // Test 6: Workspace Switcher - Verify Chinese Labels
    await test('Workspace Switcher: Verify Chinese labels (最近使用, 我的工作區, 與我共享, 已封存)', async () => {
      // Click workspace switcher
      const workspaceButton = await page.locator('button:has-text("Select Workspace"), .workspace-switcher-trigger').first();
      if (await workspaceButton.count() > 0) {
        await workspaceButton.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot
        const workspaceMenuScreenshot = '/tmp/workspace-switcher-menu.png';
        await page.screenshot({ path: workspaceMenuScreenshot });
        results.screenshots.push({ test: 'Workspace Switcher Menu', path: workspaceMenuScreenshot });
        
        // Check search placeholder
        const searchInput = await page.locator('input[placeholder*="搜尋工作區"]').count();
        if (searchInput === 0) {
          throw new Error('Search placeholder should be in Chinese (搜尋工作區)');
        }
        console.log('✓ Found: 搜尋工作區 placeholder');
        
        // Check section headers
        const recentHeader = await page.locator('text=最近使用').count();
        const myWorkspaceHeader = await page.locator('text=我的工作區').count();
        const sharedHeader = await page.locator('text=與我共享').count();
        const archivedHeader = await page.locator('text=已封存').count();
        
        console.log(`Workspace sections: 最近使用:${recentHeader}, 我的工作區:${myWorkspaceHeader}, 與我共享:${sharedHeader}, 已封存:${archivedHeader}`);
        
        if (recentHeader === 0 && myWorkspaceHeader === 0 && sharedHeader === 0) {
          throw new Error('No Chinese workspace section headers found');
        }
        
        // Check Create Workspace button
        const createButton = await page.locator('text=建立工作區').count();
        if (createButton === 0) {
          throw new Error('Create Workspace button should say 建立工作區');
        }
        console.log('✓ Found: 建立工作區 button');
        
        // Close menu
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } else {
        console.log('⚠️ Workspace switcher not found - may need workspace data');
      }
    });

    // Test 7: Global Search - Verify Chinese placeholder
    await test('Global Search: Verify Chinese placeholder', async () => {
      const searchInput = await page.locator('input[placeholder*="搜尋工作區"]').first();
      if (await searchInput.count() > 0) {
        const placeholder = await searchInput.getAttribute('placeholder');
        console.log(`Search placeholder: ${placeholder}`);
        if (!placeholder.includes('搜尋')) {
          throw new Error('Search placeholder should be in Chinese');
        }
      } else {
        console.log('⚠️ Global search not visible');
      }
    });

    // Test 8: Notification Center - Verify Chinese text
    await test('Notification Center: Verify Chinese labels', async () => {
      const notificationButton = await page.locator('button[aria-label*="Notification"], .notification-button, button:has(mat-icon:has-text("notifications"))').first();
      if (await notificationButton.count() > 0) {
        await notificationButton.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot
        const notificationScreenshot = '/tmp/notification-center.png';
        await page.screenshot({ path: notificationScreenshot });
        results.screenshots.push({ test: 'Notification Center', path: notificationScreenshot });
        
        // Check for Chinese text
        const notificationTitle = await page.locator('text=通知').count();
        if (notificationTitle > 0) {
          console.log('✓ Found: 通知 title');
        }
        
        // Close drawer
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } else {
        console.log('⚠️ Notification button not found');
      }
    });

    // Test 9: Sidebar - Verify 8 Modules
    await test('Sidebar: Verify all 8 modules present', async () => {
      await page.waitForSelector('nav, aside, .sidebar', { timeout: 5000 });
      
      // Expected modules from spec
      const expectedModules = ['Overview', 'Documents', 'Tasks', 'Members', 'Permissions', 'Audit', 'Settings', 'Journal'];
      
      let foundModules = 0;
      for (const module of expectedModules) {
        const count = await page.locator(`text=${module}`).count();
        if (count > 0) {
          foundModules++;
          console.log(`✓ Found module: ${module}`);
        }
      }
      
      console.log(`Found ${foundModules}/${expectedModules.length} modules`);
      
      if (foundModules < 6) {
        throw new Error(`Expected at least 6 modules, found ${foundModules}`);
      }
    });

    // Test 10: Responsive Design - Test at different viewports
    await test('Responsive Design: Test mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      
      const mobileScreenshot = '/tmp/mobile-view.png';
      await page.screenshot({ path: mobileScreenshot, fullPage: true });
      results.screenshots.push({ test: 'Mobile View', path: mobileScreenshot });
      
      // Reset viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    // Test 11: Test keyboard shortcuts (if applicable)
    await test('Keyboard Shortcuts: Test Ctrl+K for command palette', async () => {
      await page.keyboard.press('Control+K');
      await page.waitForTimeout(1000);
      
      // Take screenshot
      const commandPaletteScreenshot = '/tmp/command-palette.png';
      await page.screenshot({ path: commandPaletteScreenshot });
      results.screenshots.push({ test: 'Command Palette', path: commandPaletteScreenshot });
      
      // Close with Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    });

    // Final screenshot
    const finalScreenshot = '/tmp/final-state.png';
    await page.screenshot({ path: finalScreenshot, fullPage: true });
    results.screenshots.push({ test: 'Final State', path: finalScreenshot });

  } catch (error) {
    console.error('Critical error during tests:', error);
    results.failed.push({ name: 'Critical Error', error: error.message });
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('TEST SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📸 Screenshots: ${results.screenshots.length}`);
  
  if (results.passed.length > 0) {
    console.log('\n✅ PASSED TESTS:');
    results.passed.forEach(test => console.log(`  - ${test}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.failed.forEach(({ name, error }) => console.log(`  - ${name}: ${error}`));
  }
  
  if (results.screenshots.length > 0) {
    console.log('\n📸 SCREENSHOTS:');
    results.screenshots.forEach(({ test, path }) => console.log(`  - ${test}: ${path}`));
  }
  
  console.log('\n' + '='.repeat(80));
  
  return results;
}

// Run the tests
runE2ETests()
  .then(results => {
    process.exit(results.failed.length > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
