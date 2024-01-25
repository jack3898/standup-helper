import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TypedStorage } from '../utils/index.js';
import { z } from 'zod';

const storageSchema = {
	patToken: z.string().nullable()
};

export const storageZodSchema = z.object(storageSchema);

export type StorageContextData = z.infer<typeof storageZodSchema>;

export type StorageContextType = {
	storageData: StorageContextData;
	setStorage: (key: StorageKeys, value: unknown) => void;
};

const StorageContext = createContext<StorageContextType | null>(null);

type StorageKeys = keyof StorageContextData;

const typedStorage = new TypedStorage({
	patToken: z.string().nullable()
});

export function StorageProvider(props: { children: React.ReactNode }): JSX.Element {
	const [storageState, setStorageData] = useState({
		patToken: null
	} as StorageContextData);

	useEffect(() => {
		// Set updates to storage in the state
		const handler = (changes: Record<string, chrome.storage.StorageChange>): void => {
			setStorageData({
				patToken: changes.patToken?.newValue
			});
		};

		// Get initial storage data
		typedStorage.get('patToken').then((result) => {
			setStorageData({ patToken: result });
		});

		chrome.storage.onChanged.addListener(handler);

		return () => {
			chrome.storage.onChanged.removeListener(handler);
		};
	}, []);

	const setStorage = useCallback((key: StorageKeys, value: unknown) => {
		typedStorage.set(key, value);
	}, []);

	return (
		<StorageContext.Provider
			value={{
				storageData: storageState,
				setStorage
			}}
		>
			{props.children}
		</StorageContext.Provider>
	);
}

/**
 * Hook to access the storage API, changes to the storage are automatically reflected in the state.
 */
export function useStorage(): StorageContextType {
	const context = useContext(StorageContext);

	if (!context) {
		throw new Error('useStorage must be used within a StorageProvider');
	}

	return context;
}
