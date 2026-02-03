# Admin Dashboard - Debugging Guide

## Issue
Admin dashboard shows 0 for all companies and customers, but there should be data.

## Debugging Steps

### 1. Check Backend Logs
After restarting the Authentication service (port 8081), check the console logs when you load the admin dashboard. You should see:
- "Total users in database: X"
- "Found company: username (role_id: 2)"
- "Found customer: username (role_id: 1)"
- "Total companies found: X"
- "Total customers found: X"

### 2. Test API Endpoints Directly

Open these URLs in your browser (while logged in as admin):

**Check all users:**
```
http://localhost:8081/admin/debug/all-users
```
This will show ALL users with their role IDs. Check if:
- There are users with `roleId: 1` (CUSTOMER)
- There are users with `roleId: 2` (TRAVEL_COMPANY)

**Check companies:**
```
http://localhost:8081/admin/all-companies
```

**Check customers:**
```
http://localhost:8081/admin/all-customers
```

### 3. Check Browser Console
1. Open Admin Dashboard
2. Press F12 → Console tab
3. Look for:
   - "Fetching admin data..."
   - "API Responses: {pending: 200, companies: 200, ...}"
   - "Data received: {pending: 0, companies: 0, customers: 0, ...}"

### 4. Check Database

Run this SQL query in MySQL:
```sql
SELECT user_id, username, email, role_id, status 
FROM users 
WHERE role_id IN (1, 2);
```

This will show all customers (role_id=1) and travel companies (role_id=2).

### 5. Common Issues

#### Issue: No users in database
**Solution:** Register some users:
- Register as a customer (role_id should be 1)
- Register as a travel company (role_id should be 2)

#### Issue: Wrong role IDs
**Solution:** Check the `role` table:
```sql
SELECT * FROM role;
```
Should show:
- role_id: 1, rname: 'CUSTOMER'
- role_id: 2, rname: 'TRAVEL_COMPANY'
- role_id: 4, rname: 'ADMIN'

#### Issue: API returns empty array
**Solution:** 
- Check backend logs for the debug messages
- Verify users exist with correct role_id
- Check if CORS is blocking requests

#### Issue: CORS errors in browser console
**Solution:** 
- Restart Authentication service (port 8081)
- Check that `@CrossOrigin` is on AdminController
- Clear browser cache

## What I've Added

1. ✅ Debug logging in AdminService
2. ✅ Enhanced error handling in frontend
3. ✅ Debug endpoint `/admin/debug/all-users` to see all users

## Next Steps

1. **Restart Authentication service** (port 8081)
2. **Open browser console** (F12) and check logs
3. **Test the debug endpoint**: `http://localhost:8081/admin/debug/all-users`
4. **Check database** to verify users exist with correct role_ids

The debug logs will tell you exactly what's happening!
