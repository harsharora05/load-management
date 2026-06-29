import { db } from '@/lib/database';
import { seedDatabase } from '@/lib/database/seed';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const DatabaseContext = createContext({});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [isDbLoading, setIsDbLoading] = useState(true);

    useEffect(() => {
        const setup = async () => {
            try {
                await db.initialize();
                await seedDatabase();
                setIsDbLoading(false);
            } catch (error) {
                console.error('Database setup failed', error);
            }
        };

        setup();
    }, []);

    if (isDbLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return <DatabaseContext.Provider value={{}}>{children}</DatabaseContext.Provider>;
}

export const useDatabase = () => {
    return useContext(DatabaseContext);
};