# Debugging "Failed to fetch" Error

## Quick Checks

### 1. Verify Backend is Actually Running
Open a new browser tab and try:
- `http://localhost:8082/trips/all`
- `http://localhost:8082/packages/all`

**Expected:** You should see JSON data or at least a response (not "connection refused")

**If you get "connection refused":**
- Backend is NOT running
- Start the Spring Boot Travel_Management application

### 2. Check Browser Console (F12)
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for CORS errors (red text)
4. Look for network errors

### 3. Check Network Tab
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try booking again
4. Look for the request to `/bookings/book`
5. Click on it to see:
   - Request URL
   - Request Method
   - Status Code
   - Response Headers
   - Error message

### 4. Check Backend Console
Look at your Spring Boot application console for:
- "Received booking request: ..." (should appear if request reaches backend)
- Any error messages
- Stack traces

## What I've Fixed

1. ✅ Added OPTIONS handler for CORS preflight
2. ✅ Enhanced error handling in BookingController
3. ✅ Changed response to JSON format
4. ✅ Added detailed logging in frontend
5. ✅ Better error messages

## Next Steps

1. **Restart Backend Server**
   - Stop the Spring Boot application
   - Start it again (to load the new OPTIONS handler)

2. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Or use Incognito/Private mode

3. **Try Again**
   - Refresh the page
   - Try booking again
   - Check console for new detailed logs

## Common Issues

### Issue: CORS Error in Console
**Solution:** The OPTIONS handler should fix this. Restart backend.

### Issue: 404 Not Found
**Solution:** Check that endpoint is `/bookings/book` (not `/booking/book`)

### Issue: 500 Internal Server Error
**Solution:** Check backend console for exception details. Likely a database issue.

### Issue: Still "Failed to fetch"
**Solution:** 
- Check if backend is on port 8082
- Check firewall/antivirus settings
- Try accessing backend directly in browser

## Test Endpoint Directly

You can test if the backend is reachable by opening:
```
http://localhost:8082/trips/all
```

If this works, the backend is running. If not, the backend is not accessible.
