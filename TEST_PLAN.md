# Family Pantry App - Manual Test Plan

## Setup
1. Start emulators:
   ```bash
   firebase emulators:start
   ```
2. In another terminal, run the app:
   ```bash
   npm run dev
   ```
3. Run the emulator setup script:
   ```bash
   python scripts/db_emulator.py
   ```

## Test Scenarios

### 1. Authentication
- [ ] Visit http://localhost:5173
- [ ] Should redirect to /login
- [ ] Try logging in with incorrect credentials
  - Email: wrong@example.com
  - Password: wrong
  - Should show error message
- [ ] Log in with test account
  - Email: test@example.com
  - Password: password123
  - Should redirect to main app

### 2. Pantry Selection
- [ ] Should see "Test Pantry" in dropdown
- [ ] Select "Test Pantry"
- [ ] Verify items appear in both lists
- [ ] Create new pantry:
  - Click "New Pantry"
  - Name: "Weekend House"
  - Location: "Mountain Cabin"
  - Should appear in dropdown

### 3. Item Management
- [ ] Add item to In Stock:
  - Name: "Milk"
  - Quantity: 2
  - Unit: "l"
  - Should appear in list
- [ ] Move item to Shopping List
  - Click move button
  - Should disappear from In Stock
  - Should appear in Shopping List
- [ ] Delete item
  - Click delete button
  - Should be removed

### 4. Sharing & Invites
- [ ] Click share button
- [ ] Generate invite link
- [ ] Open link in incognito window
- [ ] Create new account with invite:
  - Email: new@example.com
  - Password: password123
- [ ] Verify new user can see shared pantry
- [ ] Verify new user can add/edit items

### 5. Language Support
- [ ] Change language to Norwegian
  - UI should update
  - Items should remain
- [ ] Change back to English
  - UI should update back

### 6. Error Handling
- [ ] Disconnect internet
  - Should show sync error icon
- [ ] Reconnect internet
  - Should show synced icon
- [ ] Try deleting non-owned pantry
  - Should show error message

### 7. Logout Flow
- [ ] Click logout
- [ ] Should redirect to login
- [ ] Verify can't access app without login

## Expected Initial Data
- Test User:
  - Email: test@example.com
  - Password: password123
  - Has: "Test Pantry" with some items
- Best User:
  - Email: best@example.com
  - Password: password123
  - Has: "Best Pantry" with different items

## 1. Authentication

### Sign Up

- [ ] Create account with email/password
- [ ] Validate email format requirements
- [ ] Validate password requirements
- [ ] Test Google sign-in
- [ ] Verify redirect after successful signup
- [ ] Test error handling for duplicate emails

### Sign In

- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Test "Remember me" functionality
- [ ] Test error handling for wrong password
- [ ] Test error handling for non-existent account
- [ ] Verify redirect after successful login

### Sign Out

- [ ] Verify sign out works
- [ ] Check redirect after sign out
- [ ] Verify protected routes are inaccessible after logout

## 2. Pantry Management

### Create Pantry

- [ ] Create new pantry with name
- [ ] Create pantry with location
- [ ] Verify user becomes owner
- [ ] Test validation (empty name, etc)

### Edit/Delete Pantry

- [ ] Rename pantry
- [ ] Change location
- [ ] Delete pantry (owner only)
- [ ] Verify delete confirmation dialog
- [ ] Test delete with wrong confirmation text

## 3. Item Management

### Add Items

- [ ] Add item to In Stock
- [ ] Add item to Shopping List
- [ ] Test quantity field
- [ ] Test unit selection
- [ ] Test custom unit input
- [ ] Verify real-time updates

### Edit Items

- [ ] Edit item name
- [ ] Edit quantity
- [ ] Edit unit
- [ ] Verify changes reflect immediately

### Move Items

- [ ] Move from In Stock to Shopping List
- [ ] Move from Shopping List to In Stock
- [ ] Verify item maintains properties when moved
- [ ] Test multiple moves rapidly

### Delete Items

- [ ] Delete from In Stock
- [ ] Delete from Shopping List
- [ ] Verify immediate removal
- [ ] Test undo/confirmation if implemented

## 4. Sharing & Collaboration

### Share Pantry

- [ ] Create invite link (owner only)
- [ ] Copy link to clipboard
- [ ] Verify link expiration
- [ ] Test link reuse prevention

### Join Pantry

- [ ] Join with valid link
- [ ] Test expired link
- [ ] Test already used link
- [ ] Test when already a member
- [ ] Verify correct permissions assigned

### Multi-user Testing

- [ ] Verify real-time updates between users
- [ ] Test concurrent edits
- [ ] Verify permissions (owner vs editor)
- [ ] Test member list display

## 5. Language Support

- [ ] Test Norwegian translation completeness
- [ ] Test English translation completeness
- [ ] Test Russian translation completeness
- [ ] Verify language persistence
- [ ] Check all dialogs in each language

## 6. Mobile & Responsive

- [ ] Test on small screens (320px width)
- [ ] Test on medium screens (768px width)
- [ ] Test on large screens (1024px+)
- [ ] Verify touch interactions
- [ ] Test orientation changes

## 7. Error Handling

- [ ] Test offline behavior
- [ ] Test slow connection behavior
- [ ] Verify error messages are clear
- [ ] Check sync status indicator
- [ ] Test recovery from errors

## 8. Edge Cases

- [ ] Test with very long item names
- [ ] Test with large numbers of items
- [ ] Test with many pantry members
- [ ] Test rapid sequential operations
- [ ] Test browser refresh/reload scenarios

## Notes

- Document any bugs found
- Note any UI/UX improvements needed
- Track performance issues
- List any missing features discovered during testing
