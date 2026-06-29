# SQLite Users Database Setup

Simple SQLite database with **users only** for both mobile app and admin web app.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT NOT NULL,
  profilePicture TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zipCode TEXT,
  role TEXT NOT NULL DEFAULT 'user',  -- 'admin' or 'user'
  isActive INTEGER DEFAULT 1,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

### SyncLog Table (for offline-first)
```sql
CREATE TABLE syncLog (
  id TEXT PRIMARY KEY,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  action TEXT NOT NULL,
  data TEXT NOT NULL,
  isSynced INTEGER DEFAULT 0,
  syncedAt TEXT,
  createdAt TEXT NOT NULL
);
```

## File Structure

```
lib/
├── database/
│   ├── schema.ts              # Type definitions & SQL
│   ├── db.ts                  # Core database service
│   ├── DatabaseProvider.tsx   # React context provider
│   ├── index.ts               # Module exports
│   ├── repositories/
│   │   └── UserRepository.ts  # User CRUD operations
│   └── services/
│       └── SyncService.ts     # Offline sync
└── hooks/
    └── useUsers.ts            # React hooks for users
```

## Usage Examples

### 1. Create a User
```typescript
import { useUserCrud } from '@/lib/hooks/useUsers';

export function SignUpScreen() {
    const { createUser, loading, error } = useUserCrud();

    const handleSignUp = async () => {
        try {
            const newUser = await createUser({
                name: 'John Doe',
                email: 'john@example.com',
                phone: '555-0000',
                password: 'hashed_password', // should be hashed
                role: 'user',
                isActive: true,
            });
            console.log('User created:', newUser);
        } catch (err) {
            console.error('Sign up failed:', err);
        }
    };

    return (
        <TouchableOpacity onPress={handleSignUp} disabled={loading}>
            <Text>{loading ? 'Creating...' : 'Sign Up'}</Text>
        </TouchableOpacity>
    );
}
```

### 2. Get All Users
```typescript
import { useUsers } from '@/lib/hooks/useUsers';

export function UsersListScreen() {
    const { users, loading, error, refetch } = useUsers();

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <FlatList
            data={users}
            keyExtractor={u => u.id}
            renderItem={({ item }) => (
                <Text>{item.name} ({item.email})</Text>
            )}
        />
    );
}
```

### 3. Search Users
```typescript
import { useSearchUsers } from '@/lib/hooks/useUsers';

export function SearchUsersScreen() {
    const [query, setQuery] = useState('');
    const { results, loading } = useSearchUsers(query);

    return (
        <>
            <TextInput
                placeholder="Search users..."
                value={query}
                onChangeText={setQuery}
            />
            <FlatList
                data={results}
                keyExtractor={u => u.id}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />
        </>
    );
}
```

### 4. Get Single User
```typescript
import { useUser } from '@/lib/hooks/useUsers';

export function UserDetailScreen({ userId }) {
    const { user, loading, error } = useUser(userId);

    if (loading) return <Text>Loading...</Text>;
    if (!user) return <Text>User not found</Text>;

    return (
        <View>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Role: {user.role}</Text>
        </View>
    );
}
```

### 5. Update User
```typescript
const { updateUser } = useUserCrud();

await updateUser(userId, {
    name: 'Jane Doe',
    phone: '555-1234',
});
```

### 6. Delete User (Soft Delete)
```typescript
const { deleteUser } = useUserCrud();

await deleteUser(userId); // Sets isActive = 0
```

## Direct Repository Usage

If you prefer to use the repository directly:

```typescript
import { userRepository } from '@/lib/database';

// Create
const newUser = await userRepository.create({...});

// Read
const user = await userRepository.getById(userId);
const userByEmail = await userRepository.getByEmail('john@example.com');
const allUsers = await userRepository.getAll();
const admins = await userRepository.getByRole('admin');
const searchResults = await userRepository.search('john');

// Update
await userRepository.update(userId, { name: 'Updated Name' });

// Delete (soft)
await userRepository.delete(userId);

// Delete (hard)
await userRepository.hardDelete(userId);
```

## Offline-First Sync

Changes are automatically logged to the `syncLog` table:

```typescript
import { syncService } from '@/lib/database';

// Get unsynced changes
const changes = await syncService.getUnsyncedChanges();

// Sync with server
await syncService.sync('https://api.example.com');
```

## Network Monitoring

Automatic sync when device comes back online:

```typescript
import { initializeNetworkMonitoring } from '@/lib/services/NetworkService';

// In app root (app/_layout.tsx)
useEffect(() => {
    initializeNetworkMonitoring('https://api.example.com');
}, []);
```

## Database Initialization

The database is automatically initialized via the `DatabaseProvider`:

```typescript
import { DatabaseProvider } from '@/lib/database';

export default function App() {
    return (
        <DatabaseProvider>
            <YourApp />
        </DatabaseProvider>
    );
}
```
