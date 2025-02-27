# Family Pantry App - Manual Test Plan

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
