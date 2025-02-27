# Family Pantry App - Manual Test Plan

## Setup & Initial Data

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

### Test Accounts
- Test User:
  - Email: test@example.com
  - Password: password123
  - Has: "Test Pantry" with some items
- Best User:
  - Email: best@example.com
  - Password: password123
  - Has: "Best Pantry" with different items

## Test Scenarios

### 1. Authentication
- [ ] Initial Load
  - Visit http://localhost:5173
  - Should redirect to /login
- [ ] Sign In Validation
  - Try incorrect credentials (wrong@example.com/wrong)
  - Verify error message is clear
  - Test password requirements
  - Test email format validation
- [ ] Successful Sign In
  - Use test@example.com/password123
  - Verify redirect to main app
  - Test "Remember me" functionality
- [ ] Sign Out Flow
  - Click logout
  - Verify redirect to login
  - Verify clean state after sign out
  - Check protected routes are inaccessible

### 2. Pantry Management
- [ ] Initial View
  - Should see "Test Pantry" in dropdown
  - Select "Test Pantry"
  - Verify items appear in both lists
- [ ] Create New Pantry
  - Click "New Pantry"
  - Name: "Weekend House"
  - Location: "Mountain Cabin"
  - Verify appears in dropdown
  - Verify user becomes owner
- [ ] Edit/Delete
  - Test rename pantry
  - Test location change
  - Test delete (owner only)
  - Verify delete confirmation

### 3. Item Management
- [ ] Add Items
  - Add to In Stock:
    - Name: "Milk"
    - Quantity: 2
    - Unit: "l"
  - Verify appears in list
  - Test unit selection
  - Test custom units
- [ ] Move Items
  - Move item to Shopping List
  - Verify disappears from In Stock
  - Verify appears in Shopping List
  - Test multiple moves rapidly
- [ ] Delete Items
  - Click delete button
  - Verify immediate removal
  - Test undo if implemented

### 4. Sharing & Collaboration
- [ ] App Invitation (New User)
  - Click user menu in top right
  - Generate and copy invite link
  - Test in incognito window
  - Create new account (new@example.com)
  - Verify redirect to main app
- [ ] Pantry Sharing
  - Click "Share" button by pantry selector
  - Generate invite link
  - Test with new user (incognito)
  - Test with existing user (best@example.com)
  - Verify both can access and edit
  - Verify real-time updates
- [ ] Permissions
  - Verify owner vs editor rights
  - Test expired/used links
  - Test member list display

### 5. Language Support
- [ ] Change to Norwegian
  - Verify UI updates
  - Verify items remain unchanged
- [ ] Return to English
  - Verify complete translation
  - Check all dialogs

### 6. Error Handling & Edge Cases
- [ ] Network Issues
  - Test offline behavior
  - Check sync status indicator
  - Verify recovery on reconnect
- [ ] Data Limits
  - Test long item names
  - Test many items
  - Test many members
- [ ] Rapid Operations
  - Test quick sequential actions
  - Test concurrent edits
  - Test browser refresh/reload

### 7. Mobile & Responsive
- [ ] Screen Sizes
  - Test 320px width
  - Test 768px width
  - Test 1024px+
- [ ] Interactions
  - Verify touch support
  - Test orientation changes

## Notes
- Document bugs found
- Note UI/UX improvements
- Track performance issues
- List missing features
