# SQLite Quick Start Guide

## ✅ Installation Complete!

SQLite and all dependencies are now installed and ready to use.

## 📦 What Was Installed

- `expo-sqlite` - Native SQLite support for Expo
- `expo-network` - Network state monitoring

## 🚀 Next Steps (Quick Setup - 5 minutes)

### Step 1: Update app/_layout.tsx

Add database initialization to your root layout:

```tsx
import { DatabaseProvider } from '@/lib/database';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      {/* Your existing layout code */}
    </DatabaseProvider>
  );
}
```

### Step 2: Update app/(tabs)/_layout.tsx

Add network monitoring initialization:

```tsx
import { useEffect } from 'react';
import { initializeNetworkMonitoring } from '@/lib/services/NetworkService';

export default function TabLayout() {
  useEffect(() => {
    // Initialize network monitoring for auto-sync
    const serverUrl = 'https://your-api.com'; // Replace with your API URL
    initializeNetworkMonitoring(serverUrl);
  }, []);

  return (
    // Your existing tab navigation
  );
}
```

### Step 3: Use in Your Components

Example - Display customers:

```tsx
import { useCustomers } from '@/lib/hooks/useDatabase';

export default function CustomersScreen() {
  const { customers, loading, refresh } = useCustomers();

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

### Step 4: Add Customer (Create)

```tsx
import { useCustomerCrud } from '@/lib/hooks/useDatabase';

const { createCustomer, loading } = useCustomerCrud();

await createCustomer({
  name: 'John Doe',
  phone: '555-1234',
  email: 'john@example.com',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
});
```

## 📚 Complete Documentation

See [SQLite_SETUP.md](./SQLite_SETUP.md) for:
- Detailed API reference
- All available hooks
- Advanced patterns
- Sync configuration
- Troubleshooting

## 🗄️ Database Structure

```
customers         - Customer info (name, phone, email, address, etc)
loads            - Load/cargo info (weight, category, description)
journeys         - Routes (customer → load → origin → destination)
syncLog          - Offline changes pending sync
```

All tables support:
- ✅ Create, Read, Update, Delete
- ✅ Soft deletes (recoverable)
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Offline storage

## 🔄 Offline-First Features

**What happens offline:**
- All data reads from local database ✅
- All data writes stored locally ✅
- Changes logged for sync ✅
- UI remains responsive ✅

**When online:**
- Changes automatically sync to server
- Conflict resolution handled by sync service
- No data loss

## 💻 Backend Sync Endpoint

Your backend needs a `/api/sync` endpoint:

```
POST /api/sync
{
  "entityType": "customer",
  "entityId": "123",
  "action": "create",
  "data": { ... }
}
```

## 🧪 Testing

Clear all data (development only):
```tsx
import db from '@/lib/database/db';
await db.clearAll();
```

View pending sync operations:
```tsx
import db from '@/lib/database/db';
const logs = await db.all('SELECT * FROM syncLog WHERE isSynced = 0');
```

## 📋 File Structure

```
lib/
├── database/              # Core database logic
│   ├── db.ts             # Database service
│   ├── schema.ts         # Tables & types
│   ├── DatabaseProvider  # React context
│   ├── repositories/     # Data access layer
│   ├── services/         # Sync service
│   └── index.ts          # Exports
├── hooks/                # React hooks
│   └── useDatabase.ts    # Database hooks
├── services/             # App services
│   └── NetworkService.ts # Network monitoring
└── utils/
    └── helpers.ts        # Utilities
```

## ✨ Available Hooks

```tsx
// Read
useCustomers()           // All customers
useCustomer(id)          // Single customer
useSearchCustomers(q)    // Search customers
useJourneys()            // All journeys
useJourneysByCustomer()  // Journeys for customer
useLoads()               // All loads

// Write
useCustomerCrud()        // Create/Update/Delete
useSyncStatus()          // Sync status & trigger

// System
useDatabase()            // Check DB ready
useNetworkStatus()       // Network state
useDatabaseContext()     // Get DB context
```

## 🎯 Common Tasks

**Add a new customer:**
```tsx
const { createCustomer } = useCustomerCrud();
await createCustomer({ name, phone, email, ... });
```

**Update customer:**
```tsx
const { updateCustomer } = useCustomerCrud();
await updateCustomer(customerId, { name: 'New Name' });
```

**Delete customer:**
```tsx
const { deleteCustomer } = useCustomerCrud();
await deleteCustomer(customerId);
```

**Manual sync:**
```tsx
import syncService from '@/lib/database/services/SyncService';
await syncService.sync('https://api.example.com');
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Database not ready | Wrap app in `<DatabaseProvider>` |
| Data not persisting | Check component is inside provider |
| Sync fails | Verify network, check backend endpoint |
| Offline banner shows | Check network, may be connectivity issue |

## 📞 Support

- See SQLite_SETUP.md for detailed docs
- Check EXAMPLE_INTEGRATION.tsx for full examples
- Review hook implementations in lib/hooks/useDatabase.ts

## 🎉 You're Ready!

Your mobile app now has:
- ✅ Full SQLite support
- ✅ Offline-first capabilities
- ✅ Automatic sync when online
- ✅ Type-safe operations
- ✅ Easy-to-use React hooks

Start building! 🚀
