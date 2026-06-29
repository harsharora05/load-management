# SQLite Setup Guide - Mobile App

This document explains how to use SQLite for offline-first data management in the load-management mobile app.

## Overview

SQLite is configured as the local database for the mobile app with the following features:
- **Offline-first**: All data is stored locally and works completely offline
- **Sync support**: Changes are logged and can be synced with a remote server when online
- **Soft deletes**: Deleted records are marked as deleted instead of removed (data recovery)
- **Transactions**: Support for atomic operations across multiple tables
- **Type-safe**: Full TypeScript support with interfaces for all entities

## Installation

SQLite is already installed. Run the app to initialize the database:

```bash
npm start
```

## Project Structure

```
lib/
├── database/
│   ├── db.ts                 # Core database service
│   ├── schema.ts             # Database schema & interfaces
│   ├── index.ts              # Module exports
│   ├── DatabaseProvider.tsx  # React context provider
│   ├── repositories/
│   │   ├── CustomerRepository.ts
│   │   ├── JourneyRepository.ts
│   │   └── LoadRepository.ts
│   └── services/
│       └── SyncService.ts    # Offline-first sync
├── hooks/
│   └── useDatabase.ts        # React hooks for database
└── utils/
    └── helpers.ts            # Utility functions
```

## Database Schema

### Tables

1. **customers** - Customer information
2. **loads** - Load/cargo information
3. **journeys** - Journey records (customer + load + route)
4. **syncLog** - Tracks changes for offline sync

All tables include:
- `id`: Unique identifier
- `createdAt`: ISO timestamp
- `updatedAt`: Last modification time
- `isDeleted`: Soft delete flag (0 or 1)

## Usage in Components

### 1. Setup App with Database Provider

Wrap your root component in `app/(tabs)/_layout.tsx`:

```tsx
import { DatabaseProvider } from '@/lib/database';

export default function TabLayout() {
  return (
    <DatabaseProvider>
      {/* Your layout content */}
    </DatabaseProvider>
  );
}
```

### 2. Initialize Database

In your main app entry point `app/_layout.tsx`:

```tsx
import { useDatabase } from '@/lib/hooks/useDatabase';

export default function RootLayout() {
  const { isReady, error } = useDatabase();

  if (!isReady) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return <MainApp />;
}
```

### 3. Use Database Hooks in Components

#### Get all customers:
```tsx
import { useCustomers } from '@/lib/hooks/useDatabase';

export default function CustomersScreen() {
  const { customers, loading, error, refresh } = useCustomers();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={customers}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    />
  );
}
```

#### Get single customer:
```tsx
import { useCustomer } from '@/lib/hooks/useDatabase';

export default function CustomerDetail({ customerId }) {
  const { customer, loading, error, refresh } = useCustomer(customerId);

  if (loading) return <Text>Loading...</Text>;
  if (!customer) return <Text>Not found</Text>;

  return (
    <View>
      <Text>Name: {customer.name}</Text>
      <Text>Phone: {customer.phone}</Text>
      <Text>Email: {customer.email}</Text>
    </View>
  );
}
```

#### Search customers:
```tsx
import { useSearchCustomers } from '@/lib/hooks/useDatabase';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { results, loading } = useSearchCustomers(query);

  return (
    <>
      <TextInput
        placeholder="Search customers..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={results}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={item => item.id}
      />
    </>
  );
}
```

#### Get journeys by customer:
```tsx
import { useJourneysByCustomer } from '@/lib/hooks/useDatabase';

export default function CustomerJourneys({ customerId }) {
  const { journeys, loading, error } = useJourneysByCustomer(customerId);

  return (
    <FlatList
      data={journeys}
      renderItem={({ item }) => (
        <View>
          <Text>{item.origin} → {item.destination}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

### 4. Create/Update/Delete Operations

#### Create customer:
```tsx
import { useCustomerCrud } from '@/lib/hooks/useDatabase';

export default function CreateCustomerForm() {
  const { createCustomer, loading, error } = useCustomerCrud();

  const handleCreate = async (formData) => {
    try {
      const customer = await createCustomer({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
      Alert.alert('Success', `Customer ${customer.name} created`);
    } catch (err) {
      Alert.alert('Error', error || String(err));
    }
  };

  return (
    // Form JSX
  );
}
```

#### Update customer:
```tsx
const { updateCustomer, loading, error } = useCustomerCrud();

const handleUpdate = async () => {
  const updated = await updateCustomer(customerId, {
    name: 'New Name',
    phone: '123456789',
  });
};
```

#### Delete customer:
```tsx
const { deleteCustomer, loading, error } = useCustomerCrud();

const handleDelete = async () => {
  await deleteCustomer(customerId);
  // Refresh list or navigate back
};
```

### 5. Sync with Remote Server

Check sync status:
```tsx
import { useSyncStatus } from '@/lib/hooks/useDatabase';

export default function SyncStatus() {
  const { syncStatus, isSyncing, sync } = useSyncStatus();

  return (
    <View>
      {syncStatus && (
        <>
          <Text>Unsynced: {syncStatus.totalUnsync}</Text>
          <Text>Customers: {syncStatus.byType.customer}</Text>
          <Text>Journeys: {syncStatus.byType.journey}</Text>
          <Text>Loads: {syncStatus.byType.load}</Text>
        </>
      )}
      <Button
        title="Sync Now"
        onPress={() => sync('https://your-api.com')}
        disabled={isSyncing}
      />
    </View>
  );
}
```

## Direct Database Access

For advanced operations, access repositories directly:

```tsx
import { customerRepository, journeyRepository } from '@/lib/database';

// Get all customers
const allCustomers = await customerRepository.getAll();

// Search
const results = await customerRepository.search('John');

// Get journeys by status
const pending = await journeyRepository.getByStatus('pending');
```

## Offline-First Sync

All create/update/delete operations are automatically logged to `syncLog` table.

### Sync Flow:

1. **User makes change** (offline) → Change is stored locally
2. **App logs change** → Entry added to `syncLog` table
3. **Network available** → `sync()` sends changes to server
4. **Server acknowledges** → Log entry marked as synced

### Manual Sync:

```tsx
import { syncService } from '@/lib/database';

// Check what's pending
const status = await syncService.getSyncStatus();

// Sync when network available
await syncService.sync('https://your-api.com/api/sync');

// Listen for sync events
syncService.onSyncStatusChange((status, message) => {
  console.log(`Sync ${status}: ${message}`);
});
```

## API Endpoint for Sync

Your backend should implement a `/api/sync` endpoint:

```typescript
POST /api/sync
Content-Type: application/json

{
  "entityType": "customer",
  "entityId": "123-abc",
  "action": "create",
  "data": {
    "id": "123-abc",
    "name": "John Doe",
    "phone": "555-1234",
    ...
  }
}
```

## Testing

### Clear Database:
```tsx
import db from '@/lib/database/db';

await db.clearAll();
```

### View Sync Log:
```tsx
import db from '@/lib/database/db';

const logs = await db.all('SELECT * FROM syncLog');
console.log(logs);
```

## Performance Tips

1. **Use hooks instead of direct database access** - Hooks handle loading states and automatic refresh
2. **Filter at database level** - Use `getByStatus()` instead of filtering in JavaScript
3. **Search with SQL LIKE** - More efficient than JavaScript filtering
4. **Batch operations** - Use `db.batch()` for multiple inserts/updates
5. **Index frequently queried columns** - Already indexed: customerId, status, isSynced

## Common Issues

### Database locked error
- Wait a few seconds and retry
- Check for long-running queries
- Use transactions for batch operations

### Sync fails
- Check network connectivity
- Verify server URL is correct
- Check sync log for details: `SELECT * FROM syncLog WHERE isSynced = 0`

### Out of sync data
- Run sync manually
- Check network connectivity
- Verify backend `/api/sync` endpoint

## Next Steps

1. ✅ SQLite is installed and ready
2. ✅ Wrap app in `DatabaseProvider`
3. ✅ Use hooks in your components
4. ⏳ Implement backend sync endpoint
5. ⏳ Test offline functionality
6. ⏳ Set up sync to run on network state change
