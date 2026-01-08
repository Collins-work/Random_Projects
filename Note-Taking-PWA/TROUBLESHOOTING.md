# Troubleshooting Guide

## Issue 1: "Sign in failed. Please try again."

### Common Causes & Solutions:

#### 1. **Domain Not Authorized**
**Problem**: Your deployed domain is not in Firebase authorized domains list.

**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (clinexnotes)
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Add your domain (e.g., `your-app.vercel.app`)
5. For local testing, ensure `localhost` is in the list

#### 2. **Pop-up Blocked**
**Problem**: Browser is blocking the Google sign-in pop-up.

**Solution**:
- Allow pop-ups for your site
- Look for blocked pop-up icon in browser address bar
- Try in a different browser (Chrome recommended)

#### 3. **Firebase SDK Not Loaded**
**Problem**: Firebase scripts fail to load before app initialization.

**Solution**:
- Check browser console for 404 errors
- Ensure you have internet connection
- Clear browser cache and refresh
- Check if CDN (gstatic.com) is accessible

#### 4. **Multiple Tabs Open**
**Problem**: Firebase persistence can only be enabled in one tab.

**Solution**:
- Close all other tabs of the app
- Refresh the current tab

### How to Debug:

1. **Open Browser Console** (F12)
2. Look for errors starting with:
   - `Firebase Auth not initialized`
   - `Firebase SDK not loaded`
   - `auth/unauthorized-domain`
   - `auth/network-request-failed`

3. **Check Network Tab**:
   - Look for failed requests to Firebase
   - Ensure Firebase scripts loaded (status 200)

---

## Issue 2: "Error 404" on Mobile Install

### Common Causes & Solutions:

#### 1. **Service Worker Path Wrong**
**Problem**: Service worker file not found at registered path.

**Solution**: ✅ **FIXED** - Updated to `/public/sw.js`

#### 2. **Manifest Icons Missing**
**Problem**: Icon paths in manifest.json point to non-existent files.

**Solution**: ✅ **FIXED** - Updated to `/public/Note.png`

#### 3. **Build/Deploy Issues**
**Problem**: Files not properly deployed to Vercel.

**Solution**:
1. Rebuild your app:
   ```bash
   npm run build
   ```
2. Check `dist` folder contains all files
3. Redeploy to Vercel
4. Clear Vercel cache if needed

#### 4. **Cache Issues**
**Problem**: Old cached version causing 404s.

**Solution**:
1. Uninstall the PWA from your phone
2. Clear browser cache
3. Visit the site again
4. Try installing fresh

### How to Debug on Mobile:

1. **Android Chrome**:
   - Connect phone to computer via USB
   - Enable USB Debugging on phone
   - Open `chrome://inspect` on desktop Chrome
   - Inspect your device and check console

2. **iOS Safari**:
   - Enable Web Inspector in Settings > Safari > Advanced
   - Connect to Mac
   - Use Safari Developer menu > Connect to device

3. **Check Service Worker**:
   - On desktop: Open DevTools > Application > Service Workers
   - Verify service worker is registered
   - Check for errors

---

## Fixed Issues in Latest Update

### ✅ Service Worker Path
- **Before**: `/sw.js` (incorrect)
- **After**: `/public/sw.js` (correct)

### ✅ Manifest Icons
- **Before**: `/Note.png` (incorrect)
- **After**: `/public/Note.png` (correct)

### ✅ Firebase Loading
- **Before**: Scripts loaded with `defer` (caused race condition)
- **After**: Scripts load synchronously before app

### ✅ Error Handling
- Added specific error messages for sign-in issues
- Better logging for debugging
- Disabled buttons during operations to prevent duplicate requests

---

## Quick Checks

### For Sign-in Issues:
```
✓ Firebase scripts loaded? (Check DevTools > Network)
✓ Domain authorized? (Check Firebase Console)
✓ Pop-ups allowed? (Check browser address bar)
✓ Internet connected? (Try opening google.com)
✓ Only one tab open? (Close others)
```

### For PWA Install Issues:
```
✓ Service worker registered? (DevTools > Application)
✓ All files deployed? (Check deployed URL)
✓ Manifest valid? (DevTools > Application > Manifest)
✓ HTTPS enabled? (PWAs require HTTPS except localhost)
✓ Icons accessible? (Try opening /public/Note.png)
```

---

## Testing After Fix

### 1. **Test Locally**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Start dev server
npm run dev
```

### 2. **Test Sign-in**:
1. Open `http://localhost:5173`
2. Open browser console (F12)
3. Click "Sign in with Google"
4. Check for any errors
5. Verify sign-in works

### 3. **Build for Production**:
```bash
npm run build
```

### 4. **Deploy**:
- Push to Git
- Vercel will auto-deploy
- OR manually deploy `dist` folder

### 5. **Test on Mobile**:
1. Visit deployed URL on phone
2. Clear browser cache
3. Try installing PWA
4. Check for 404 errors

---

## Still Having Issues?

### Collect Debug Info:

1. **Browser Console Output**:
   - Copy all errors from console
   - Screenshot if possible

2. **Network Errors**:
   - Open DevTools > Network
   - Refresh page
   - Filter by "failed" requests
   - Check which files are 404

3. **Firebase Config**:
   - Verify all fields in `src/firebase-config.js`
   - Ensure no typos in domain names

4. **Deployment Info**:
   - What platform? (Vercel, Netlify, etc.)
   - What's the deployed URL?
   - Did build succeed without errors?

### Contact Support:
- Include all debug info above
- Specify: Browser, OS, Mobile/Desktop
- Steps to reproduce the issue

---

## Prevention Tips

1. **Always Test Locally First**:
   ```bash
   npm run dev
   ```

2. **Build Before Deploy**:
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

3. **Check Authorized Domains**:
   - Add new domains to Firebase BEFORE deploying
   - Include both `example.com` and `www.example.com`

4. **Monitor Console**:
   - Keep DevTools open during testing
   - Watch for warnings and errors

5. **Version Control**:
   - Commit working versions to Git
   - Use branches for experimental changes

---

**Last Updated**: January 8, 2026
**Version**: 2.0.1 (Hotfix)
