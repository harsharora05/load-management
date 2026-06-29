/**
 * Database Provider
 * React context for database initialization
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import db from './db';

interface DatabaseContextType {
    isReady: boolean;
    error: string | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
    isReady: false,
    error: null,
});

export function useDatabaseContext() {
    return useContext(DatabaseContext);
}

interface DatabaseProviderProps {
    children: React.ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                await db.initialize();
                setIsReady(true);
            } catch (err) {
                const errorMsg = String(err);
                setError(errorMsg);
                console.error('[DatabaseProvider] Initialization error:', err);
            }
        };

        initializeDatabase();

        return () => {
            db.close();
        };
    }, []);

    return (
        <DatabaseContext.Provider value={{ isReady, error }}>
            {children}
        </DatabaseContext.Provider>
    );
}
