# Troubleshooting: "Failed to fetch" Error

## Issue
Getting "Failed to fetch" error when:
1. Booking a trip (as customer)
2. Adding a trip (as travel company)

## Possible Causes & Solutions

### 1. Backend Server Not Running
**Check:** Is the Spring Boot Travel_Management application running on port 8082?

**Solution:**
- Start the backend server
- Verify it's running on `http://localhost:8082`
- Check the console for any startup errors

### 2. Wrong Port Number
**Check:** Verify the backend is actually running on port 8082

**Solution:**
- Check `application.properties` or `application.yml` in Travel_Management
- Ensure `server.port=8082` is set correctly

### 3. CORS Configuration
**Status:** ✅ Already configured in `CorsConfig.java`

**If still having issues:**
- Restart the backend server after CORS changes
- Check browser console for CORS-specific errors

### 4. Network Connectivity
**Check:** Can you access `http://localhost:8082` directly in browser?

**Test:**
- Open `http://localhost:8082/trips/all` in browser
- Should return JSON data or an error page (not "connection refused")

### 5. Backend Endpoints
**Verified Endpoints:**
- ✅ `POST /bookings/book` - For booking trips
- ✅ `POST /trips/add` - For adding trips
- ✅ Both have CORS configured

## Enhanced Error Messages

I've updated the frontend to show more detailed error messages:
- Network errors will show: "Network error: ... Please ensure the backend server is running on port 8082"
- Server errors will show: "Failed to add trip (status): error message"

## Debugging Steps

1. **Open Browser Console (F12)**
   - Check for detailed error messages
   - Look for network request failures

2. **Check Backend Logs**
   - Look for incoming requests
   - Check for any exceptions

3. **Test Backend Directly**
   - Use Postman or curl to test endpoints
   - Verify backend is responding

4. **Verify Ports**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8082`

## Quick Fix Checklist

- [ ] Backend server is running
- [ ] Backend is on port 8082
- [ ] No firewall blocking localhost connections
- [ ] Browser console shows detailed errors
- [ ] Backend logs show incoming requests

## Files Modified

1. `Front-end/src/components/BookPackage.jsx`
   - Enhanced error handling for booking
   - Better error messages

2. `Front-end/src/components/AddTrips.jsx`
   - Enhanced error handling for adding trips
   - Better error messages
