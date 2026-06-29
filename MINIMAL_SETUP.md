# Minimal SQLite User Database

Simple setup with user login/signup only.

## Folder Structure

```
lib/
├── database/
│   ├── db.ts                    # Core database service
│   ├── schema.ts                # User schema & SQL
│   ├── DatabaseProvider.tsx     # React context
│   ├── index.ts                 # Exports
│   └── repositories/
│       └── UserRepository.ts    # User CRUD
├── services/
│   └── AuthService.ts           # Secure storage (expo-secure-store)
├── context/
│   └── AuthContext.tsx          # Auth state management
├── hooks/
│   └── useAuth.ts               # useAuth hook
└── utils/
    └── helpers.ts               # ID & timestamp helpers
```

## Quick Start

### 1. Setup Providers in App Root

```typescript
// app/_layout.tsx
import { DatabaseProvider } from '@/lib/database';
import { AuthProvider } from '@/lib/context/AuthContext';
import { RootLayoutNav } from '@/app/_layout.nav';

export default function RootLayout() {
    return (
        <DatabaseProvider>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </DatabaseProvider>
    );
}
```

### 2. Sign Up

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

export function SignUpScreen() {
    const { signUp, isLoading } = useAuth();

    const handleSignUp = async () => {
        try {
            await signUp('John Doe', 'john@example.com', 'password123', '555-0000');
            // Navigate to main app
        } catch (error) {
            Alert.alert('Error', String(error));
        }
    };

    return (
        <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
            <Text>{isLoading ? 'Creating account...' : 'Sign Up'}</Text>
        </TouchableOpacity>
    );
}
```

### 3. Sign In

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

export function SignInScreen() {
    const { signIn, isLoading } = useAuth();

    const handleSignIn = async () => {
        try {
            await signIn('john@example.com', 'password123');
            // Navigate to main app
        } catch (error) {
            Alert.alert('Error', String(error));
        }
    };

    return (
        <TouchableOpacity onPress={handleSignIn} disabled={isLoading}>
            <Text>{isLoading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>
    );
}
```

### 4. Access User Info

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

export function HomeScreen() {
    const { user, signOut } = useAuth();

    return (
        <View>
            <Text>Welcome, {user?.name}</Text>
            <TouchableOpacity onPress={signOut}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}
```

## API

### useAuth()

```typescript
const {
    user,           // AuthSession | null
    isLoading,      // boolean
    isSignedIn,     // boolean
    signUp,         // (name, email, password, phone?) => Promise
    signIn,         // (email, password) => Promise
    signOut,        // () => Promise
    restoreToken,   // () => Promise
} = useAuth();
```

## Database Operations

### Direct Repository Access

```typescript
import { userRepository } from '@/lib/database';

// Create
const user = await userRepository.create({
    name: 'John',
    email: 'john@example.com',
    password: 'hashed_password',
});

// Read
const byEmail = await userRepository.getByEmail('john@example.com');
const byId = await userRepository.getById(userId);
const allUsers = await userRepository.getAll();

// Update
await userRepository.update(userId, { name: 'Jane' });

// Delete
await userRepository.delete(userId);
```

## Features

✅ Minimal schema (users table only)  
✅ Secure storage with expo-secure-store  
✅ Auto login on app restart  
✅ Email uniqueness constraint  
✅ TypeScript support  
✅ No external dependencies except Expo  

## Security Notes

⚠️ **Password Handling**: Currently storing passwords in plain text (for demo only).  
For production:
```typescript
import * as Crypto from 'expo-crypto';

// Hash on signup
const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
);
```

⚠️ **Session Storage**: Using expo-secure-store which uses:
- iOS: Keychain
- Android: Keystore
