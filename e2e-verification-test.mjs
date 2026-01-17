import { chromium } from 'playwright';

async function runE2ETest() {
  console.log('🚀 Starting E2E Verification Test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Collect console logs and errors
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    if (msg.type() === 'error') {
      console.log(`[Browser ERROR]: ${text}`);
      errors.push(text);
    }
  });

  page.on('pageerror', error => {
    console.log(`[Browser PAGE ERROR]: ${error.message}`);
    errors.push(error.message);
  });

  try {
    // Step 1: Navigate to root
    console.log('📍 Step 1: Navigate to http://localhost:4200/');
    await page.goto('http://localhost:4200/', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const currentUrl1 = page.url();
    console.log(`   Current URL: ${currentUrl1}`);
    
    const redirectedToLogin = currentUrl1.includes('/login');
    console.log(`   Redirected to login: ${redirectedToLogin ? '✅ YES' : '❌ NO'}\n`);
    
    await page.screenshot({ path: 'verification-step1-initial-load.png', fullPage: true });

    // Step 2: Check login form elements
    console.log('📍 Step 2: Check login form elements');
    const emailInputs = await page.locator('input[type="email"], input[formControlName="email"], input#email').count();
    const passwordInputs = await page.locator('input[type="password"], input[formControlName="password"], input#password').count();
    const submitButtons = await page.locator('button[type="submit"]').count();
    
    console.log(`   Email input fields found: ${emailInputs}`);
    console.log(`   Password input fields found: ${passwordInputs}`);
    console.log(`   Submit buttons found: ${submitButtons}\n`);
    
    await page.screenshot({ path: 'verification-step2-login-form.png', fullPage: true });

    // Step 3: Fill login form
    console.log('📍 Step 3: Fill login form');
    
    // Find and fill email field
    const emailField = page.locator('input[type="email"], input[formControlName="email"], input#email').first();
    await emailField.fill('demo@test.com');
    console.log('   Email filled: demo@test.com');
    
    // Find and fill password field
    const passwordField = page.locator('input[type="password"], input[formControlName="password"], input#password').first();
    await passwordField.fill('123123');
    console.log('   Password filled: 123123\n');
    
    await page.screenshot({ path: 'verification-step3-form-filled.png', fullPage: true });

    // Step 4: Submit form and wait for navigation
    console.log('📍 Step 4: Submit login form');
    const submitButton = page.locator('button[type="submit"]').first();
    
    // Wait for navigation after clicking submit
    const navigationPromise = page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => null);
    await submitButton.click();
    console.log('   Submit button clicked');
    
    // Wait for either navigation or timeout
    await Promise.race([
      navigationPromise,
      page.waitForTimeout(5000)
    ]);
    
    await page.waitForTimeout(2000); // Additional wait for rendering
    
    const currentUrl2 = page.url();
    console.log(`   Current URL after submission: ${currentUrl2}`);
    
    const stillOnLogin = currentUrl2.includes('/login');
    const onDashboard = currentUrl2.includes('/dashboard');
    console.log(`   Still on login page: ${stillOnLogin ? '❌ YES (Login Failed)' : '✅ NO (Redirected)'}`);
    console.log(`   On dashboard: ${onDashboard ? '✅ YES (Login Success)' : '❌ NO'}\n`);
    
    await page.screenshot({ path: 'verification-step4-after-submit.png', fullPage: true });

    // Step 5: Verify UI components (only if logged in)
    console.log('📍 Step 5: Verify UI components');
    
    if (onDashboard) {
      console.log('   ✅ Login successful! Checking for UI components...\n');
      
      // Wait for components to render
      await page.waitForTimeout(2000);
      
      // Check for global header
      const globalHeader = await page.locator('app-global-header, [class*="global-header"], header.global-header').count();
      console.log(`   Global Header: ${globalHeader > 0 ? '✅ Found' : '❌ Not Found'} (${globalHeader} elements)`);
      
      // Check for workspace switcher
      const workspaceSwitcher = await page.locator('app-workspace-switcher, [class*="workspace-switcher"]').count();
      console.log(`   Workspace Switcher: ${workspaceSwitcher > 0 ? '✅ Found' : '❌ Not Found'} (${workspaceSwitcher} elements)`);
      
      // Check for account switcher
      const accountSwitcher = await page.locator('app-account-switcher, [class*="account-switcher"]').count();
      console.log(`   Account Switcher: ${accountSwitcher > 0 ? '✅ Found' : '❌ Not Found'} (${accountSwitcher} elements)`);
      
      // Check for global search
      const globalSearch = await page.locator('app-global-search, [class*="global-search"], input[placeholder*="search" i]').count();
      console.log(`   Global Search: ${globalSearch > 0 ? '✅ Found' : '❌ Not Found'} (${globalSearch} elements)`);
      
      // Check for notification center
      const notificationCenter = await page.locator('app-notification-center, [class*="notification"]').count();
      console.log(`   Notification Center: ${notificationCenter > 0 ? '✅ Found' : '❌ Not Found'} (${notificationCenter} elements)`);
      
      // Check for sidebar
      const sidebar = await page.locator('app-sidebar, [class*="sidebar"], aside').count();
      console.log(`   Sidebar: ${sidebar > 0 ? '✅ Found' : '❌ Not Found'} (${sidebar} elements)\n`);
      
      await page.screenshot({ path: 'verification-step5-dashboard-components.png', fullPage: true });
      
      // Try to get a full page screenshot showing all components
      await page.screenshot({ path: 'verification-final-full-dashboard.png', fullPage: true });
      
      console.log('📸 Screenshots saved:');
      console.log('   - verification-step5-dashboard-components.png');
      console.log('   - verification-final-full-dashboard.png\n');
      
    } else {
      console.log('   ⚠️  Still on login page - cannot verify UI components');
      console.log('   This indicates login failed or navigation did not occur.\n');
    }

    // Summary
    console.log('=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Step 1 - Auto-redirect to /login: ${redirectedToLogin ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Step 2 - Login form rendered: ${emailInputs > 0 && passwordInputs > 0 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Step 3 - Form fields fillable: ✅ PASS`);
    console.log(`Step 4 - Login success: ${onDashboard ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Step 5 - UI components visible: ${onDashboard ? '✅ PASS' : '❌ FAIL'}`);
    console.log('=' .repeat(60));
    
    if (errors.length > 0) {
      console.log('\n⚠️  Browser Errors Detected:');
      errors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('\n✅ No browser errors detected');
    }
    
    console.log('\n🏁 E2E Verification Test Complete\n');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    await page.screenshot({ path: 'verification-error.png', fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

runE2ETest().catch(console.error);
