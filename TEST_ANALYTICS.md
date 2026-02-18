# Analytics Testing Guide

## 🧪 Test Plan: Verify Click Tracking Works

### Prerequisites
- Site deployed at: https://happy-operators-qr.vercel.app
- Convex backend at: https://dependable-zebra-577.eu-west-1.convex.cloud
- NEXT_PUBLIC_CONVEX_URL environment variable set in Vercel
- CONVEX_DEPLOY_KEY environment variable set in Vercel

### Test Scenario 1: Create & Track New QR Code

1. **Visit Dashboard**
   ```
   https://happy-operators-qr.vercel.app
   ```
   - ✅ Verify new sidebar design appears
   - ✅ Verify Inter font is loaded
   - ✅ Verify favicon shows in browser tab

2. **Create Test QR Code**
   - Click "+ Create New" button
   - Fill in form:
     - Name: "Test Analytics QR"
     - Target URL: "https://google.com"
   - Click "Create QR Code"
   - ✅ Verify QR code appears in grid
   - ✅ Copy the tracking URL (format: `https://happy-operators-qr.vercel.app/c/[shortId]`)

3. **Test Click Tracking**
   - Open tracking URL in **new incognito/private window**
   - ✅ Verify you're redirected to https://google.com
   - Check browser console for any errors (should be none)
   - Go back to dashboard and refresh
   - ✅ Verify click count increased from 0 to 1

4. **View Analytics Page**
   - Click "📊 View Analytics" button on the test QR card
   - ✅ Verify analytics page loads
   - ✅ Verify "Total Clicks" shows 1 (or more)
   - ✅ Verify chart displays (if multiple days)

### Test Scenario 2: Verify Error Handling

1. **Test Invalid Short ID**
   ```
   https://happy-operators-qr.vercel.app/c/invalid-short-id-123
   ```
   - ✅ Should show custom error page (not 500 error)
   - ✅ Should display "QR Code Not Found" message
   - ✅ Should have link back to dashboard

2. **Test Missing Short ID**
   ```
   https://happy-operators-qr.vercel.app/c/
   ```
   - ✅ Should return 404 or redirect

### Test Scenario 3: Multiple Clicks

1. **Track Multiple Clicks**
   - Use same tracking URL from Test 1
   - Visit it 3-5 times (in different browsers/incognito sessions)
   - ✅ Each visit should redirect successfully
   - ✅ Click count should increment each time
   - ✅ Analytics page should show updated total

2. **Check Convex Logs**
   - If you have access to Convex dashboard:
   - Go to Logs tab
   - ✅ Look for `[Convex] Recording click` messages
   - ✅ Verify no error logs

### Test Scenario 4: Design Verification

1. **Dashboard Design**
   - ✅ Sidebar on left with Happy Operators branding
   - ✅ Stats cards at top (Total QR Codes, Total Clicks, Avg Clicks)
   - ✅ QR code cards in grid layout
   - ✅ Neutral color palette with red/teal accents

2. **QR Code Card**
   - ✅ White background with subtle border
   - ✅ QR code image displayed clearly
   - ✅ Click count visible
   - ✅ Action buttons (Download, Copy URL, Analytics, Delete)
   - ✅ Hover states work on buttons

3. **Forms**
   - ✅ Clean input fields with proper focus states
   - ✅ Primary button in Happy Operators red
   - ✅ Error messages display properly

4. **Favicon**
   - ✅ Pixelated QR icon visible in browser tab
   - ✅ Red/teal accent colors visible on icon

### Expected Server Logs

When a click is tracked, you should see logs like:

```
[Click Tracking] Processing click for shortId: abc123
[Click Tracking] User Agent: Mozilla/5.0...
[Click Tracking] IP Hash: a1b2c3d4...
[Convex] Recording click for shortId: abc123
[Convex] Found QR code: Test Analytics QR Target: https://google.com
[Convex] Click recorded with ID: k1234567890
[Click Tracking] Successfully recorded click, redirecting to: https://google.com
```

### Debugging Common Issues

**Issue: Clicks not recording**

1. Check Vercel deployment logs for errors
2. Verify NEXT_PUBLIC_CONVEX_URL is set correctly
3. Check Convex dashboard for failed mutations
4. Look for console errors in browser dev tools
5. Verify the `/c/[shortId]` route is redirecting (not 404)

**Issue: Redirect not working**

1. Check that target URL includes `https://` protocol
2. Verify QR code exists in Convex database
3. Check API route logs for errors

**Issue: Analytics page shows 0 clicks**

1. Wait 5-10 seconds and refresh (Convex sync delay)
2. Verify click was actually recorded in Convex dashboard
3. Check that QR code ID matches between card and analytics page

## 📊 Success Criteria

All tests pass if:
- ✅ QR codes can be created
- ✅ Tracking URLs redirect to target URLs
- ✅ Click counts increment correctly
- ✅ Analytics page displays accurate data
- ✅ Design matches OSCR HQ aesthetic
- ✅ Favicon displays correctly
- ✅ Error handling works properly
- ✅ No console errors

## 🎯 Performance Checks

- Dashboard loads in <2 seconds
- QR code creation completes in <3 seconds
- Click redirect happens in <1 second
- Analytics page loads in <2 seconds

---

**Note:** If you encounter any issues, check:
1. Vercel deployment status
2. Convex function deployment status
3. Browser console for errors
4. Network tab for failed requests
