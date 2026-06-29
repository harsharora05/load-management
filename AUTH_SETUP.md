# Authentication Pages - Setup Guide

## Overview

Simple and clean Sign In and Sign Up screens are now ready to use.

## Sign Up Page Features

**Required Fields:**
- Full Name
- Email Address
- Phone Number
- Password (min 6 characters)
- Confirm Password

**Features:**
- ✅ Form validation with error messages
- ✅ Real-time error clearing as user types
- ✅ Disabled inputs during submission
- ✅ Loading state with spinner
- ✅ Auto-saves customer to SQLite database
- ✅ Redirect to Sign In after successful signup

## Sign In Page Features

**Fields:**
- Email Address
- Password

**Features:**
- ✅ Form validation
- ✅ Loading state
- ✅ Forgot password link (placeholder)
- ✅ Redirect to main app on success

## Usage

### Current Flow
```
App Start
  ↓
Sign In / Sign Up (auth screens)
  ↓
Main App (tabs)
```

### Navigation
- **From Sign In** → Can navigate to Sign Up
- **From Sign Up** → Can navigate back to Sign In
- **After Sign Up** → Auto-redirects to Sign In
- **After Sign In** → Navigates to main app `/(tabs)`

## Integration with SQLite

**Sign Up** automatically creates a customer record in SQLite with:
- Name
- Email
- Phone
- Empty address fields (can be filled later)

The data is stored offline and syncs when network is available.

## Styling

- **Color Scheme:** Green (#4CAF50) theme
- **Input Fields:** Light gray background with border on focus
- **Error States:** Red border and light pink background
- **Buttons:** Full-width green button with white text
- **Typography:** Clean, modern sans-serif

## Customization

To modify styles, edit the `styles` object at the bottom of each file:

```tsx
const styles = {
  title: {
    fontSize: 28,  // Adjust font size
    fontWeight: 'bold',
    color: '#000',
  },
  signUpButton: {
    backgroundColor: '#4CAF50',  // Change button color
    // ...
  },
  // ... more styles
};
```

## TODO / Future Enhancements

1. **Backend Integration:**
   - Replace placeholder auth with real backend API
   - Add JWT token management
   - Implement secure password storage

2. **Forgot Password:**
   - Implement password reset flow

3. **Form Features:**
   - Remember email checkbox
   - Social login (Google, Apple)
   - Terms & conditions checkbox

4. **Validation:**
   - Add password strength meter
   - Email verification
   - Phone number verification

5. **Security:**
   - Biometric login
   - Rate limiting
   - CAPTCHA

## Current Limitations

- No backend authentication yet (just validates form)
- Password stored in plain text in SQLite (need encryption)
- No session management
- No refresh tokens

## Next Steps

1. Test the UI in your app
2. Connect to your backend API
3. Implement actual authentication logic in `handleSignIn()`
4. Add password hashing before storing
5. Implement session/token management
