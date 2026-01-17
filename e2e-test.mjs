import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Starting E2E Test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[Browser ${type.toUpperCase()}]:`, msg.text());
    }
  });
  
  try {
    // Step 1: Navigate to root URL
    console.log('📍 Step 1: Navigating to http://localhost:4200/');
    await page.goto('http://localhost:4200/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    const currentUrl1 = page.url();
    console.log('   Current URL:', currentUrl1);
    
    // Step 2: Verify redirect to login page
    console.log('\n📍 Step 2: Verifying redirect to login page');
    const isOnLogin = currentUrl1.includes('/login');
    console.log('   Redirected to login:', isOnLogin ? '✅ YES' : '❌ NO');
    
    if (!isOnLogin) {
      console.log('   ⚠️  Expected redirect to /login did not occur');
    }
    
    // Take screenshot of current state
    await page.screenshot({ path: 'step1-initial-load.png', fullPage: true });
    console.log('   📸 Screenshot saved: step1-initial-load.png');
    
    // Step 3: Check for login form elements
    console.log('\n📍 Step 3: Checking for login form elements');
    
    const emailInputs = await page.locator('input[type="email"], input[name="email"], input[formcontrolname="email"]').count();
    const passwordInputs = await page.locator('input[type="password"], input[name="password"], input[formcontrolname="password"]').count();
    const submitButtons = await page.locator('button[type="submit"], button:has-text("登入"), button:has-text("Login")').count();
    
    console.log('   Email input fields found:', emailInputs);
    console.log('   Password input fields found:', passwordInputs);
    console.log('   Submit buttons found:', submitButtons);
    
    if (emailInputs === 0 || passwordInputs === 0) {
      console.log('   ⚠️  Login form elements not found - checking page content');
      const bodyText = await page.textContent('body');
      console.log('   Page contains "login":', bodyText.toLowerCase().includes('login'));
      console.log('   Page contains "email":', bodyText.toLowerCase().includes('email'));
    }
    
    // Step 4: Attempt to fill login form
    console.log('\n📍 Step 4: Attempting to fill login form');
    
    try {
      // Try multiple selectors for email
      const emailSelector = page.locator('input[type="email"]').first();
      
      if (await emailSelector.count() > 0) {
        await emailSelector.fill('demo@test.com');
        console.log('   ✅ Email filled: demo@test.com');
      } else {
        console.log('   ❌ Could not find email input field');
      }
      
      // Try multiple selectors for password
      const passwordSelector = page.locator('input[type="password"]').first();
      
      if (await passwordSelector.count() > 0) {
        await passwordSelector.fill('123123');
        console.log('   ✅ Password filled: 123123');
      } else {
        console.log('   ❌ Could not find password input field');
      }
      
      await page.screenshot({ path: 'step2-form-filled.png', fullPage: true });
      console.log('   📸 Screenshot saved: step2-form-filled.png');
      
    } catch (error) {
      console.log('   ❌ Error filling form:', error.message);
    }
    
    // Step 5: Submit login form
    console.log('\n📍 Step 5: Submitting login form');
    
    try {
      const submitButton = page.locator('button[type="submit"]').first();
      
      if (await submitButton.count() > 0) {
        await submitButton.click();
        console.log('   ✅ Submit button clicked');
        
        // Wait for navigation or response
        await page.waitForTimeout(3000);
        
        const currentUrl2 = page.url();
        console.log('   Current URL after submission:', currentUrl2);
        
        const isStillOnLogin = currentUrl2.includes('/login');
        console.log('   Still on login page:', isStillOnLogin ? '⚠️ YES' : '✅ NO');
        
        if (!isStillOnLogin) {
          console.log('   ✅ Login successful - redirected to:', currentUrl2);
        } else {
          console.log('   ⚠️  Still on login page - login may have failed');
        }
        
        await page.screenshot({ path: 'step3-after-submit.png', fullPage: true });
        console.log('   📸 Screenshot saved: step3-after-submit.png');
        
      } else {
        console.log('   ❌ Could not find submit button');
      }
      
    } catch (error) {
      console.log('   ❌ Error submitting form:', error.message);
    }
    
    // Step 6: Verify authenticated state
    console.log('\n📍 Step 6: Verifying authenticated state and UI components');
    
    // Check for header components mentioned in the issue
    const headerExists = await page.locator('app-global-header, [data-testid="global-header"]').count();
    const workspaceSwitcher = await page.locator('app-workspace-switcher, [data-testid="workspace-switcher"]').count();
    const accountSwitcher = await page.locator('app-account-switcher, [data-testid="account-switcher"]').count();
    const globalSearch = await page.locator('app-global-search, [data-testid="global-search"]').count();
    const notificationCenter = await page.locator('app-notification-center, [data-testid="notification-center"]').count();
    const sidebar = await page.locator('app-sidebar, [data-testid="sidebar"]').count();
    
    console.log('\n   UI Component Detection:');
    console.log('   ├─ Global Header:', headerExists > 0 ? '✅ Found' : '❌ Not Found');
    console.log('   ├─ Workspace Switcher:', workspaceSwitcher > 0 ? '✅ Found' : '❌ Not Found');
    console.log('   ├─ Account Switcher:', accountSwitcher > 0 ? '✅ Found' : '❌ Not Found');
    console.log('   ├─ Global Search:', globalSearch > 0 ? '✅ Found' : '❌ Not Found');
    console.log('   ├─ Notification Center:', notificationCenter > 0 ? '✅ Found' : '❌ Not Found');
    console.log('   └─ Sidebar:', sidebar > 0 ? '✅ Found' : '❌ Not Found');
    
    await page.screenshot({ path: 'step4-final-state.png', fullPage: true });
    console.log('\n   📸 Final screenshot saved: step4-final-state.png');
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    console.log('Issue Verification:');
    console.log('  The problem statement indicates incomplete implementation of:');
    console.log('  - [工作區切換器] Workspace Switcher');
    console.log('  - [搜尋] Global Search');
    console.log('  - [通知] Notification Center');
    console.log('  - [設定] Settings');
    console.log('  - [身份切換器] Account Switcher');
    console.log('  - [側邊導航欄] Sidebar Navigation');
    console.log('\nTest Results:');
    console.log('  1. Auto-redirect to /login:', isOnLogin ? '✅ Working' : '❌ Not Working');
    console.log('  2. Login form elements:', (emailInputs > 0 && passwordInputs > 0) ? '✅ Present' : '❌ Missing');
    console.log('  3. Components after login:');
    console.log('     - Global Header:', headerExists > 0 ? '✅' : '❌');
    console.log('     - Workspace Switcher:', workspaceSwitcher > 0 ? '✅' : '❌');
    console.log('     - Account Switcher:', accountSwitcher > 0 ? '✅' : '❌');
    console.log('     - Global Search:', globalSearch > 0 ? '✅' : '❌');
    console.log('     - Notification Center:', notificationCenter > 0 ? '✅' : '❌');
    console.log('     - Sidebar:', sidebar > 0 ? '✅' : '❌');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('📸 Error screenshot saved: error-screenshot.png');
  } finally {
    await browser.close();
    console.log('\n✅ Test completed and browser closed');
  }
})();
