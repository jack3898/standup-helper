import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type StorageContextData = {
	patToken: string | null;
};

export type StorageContextType = {
	storageData: StorageContextData;
	setStorage: (key: StorageKeys, value: unknown) => void;
};

const StorageContext = createContext<StorageContextType | null>(null);

type StorageKeys = 'patToken';

export function StorageProvider(props: { children: React.ReactNode }): JSX.Element {
	const [storageState, setStorageData] = useState({
		patToken: null
	} as StorageContextData);

	useEffect(() => {
		// Set updates to storage in the state
		const handler = (changes: Record<string, chrome.storage.StorageChange>): void => {
			// Extract only new values
			const newData = Object.entries(changes).reduce((acc, [key, { newValue }]) => {
				return {
					...acc,
					[key]: newValue
				};
			}, {} as StorageContextData);

			setStorageData({
				...newData // TODO: Use zod to validate this
			});
		};

		// Get initial storage data
		chrome.storage.local.get(null, (initialData) => {
			setStorageData({
				...(initialData as StorageContextData) // TODO: Use zod to validate this
			});
		});

		chrome.storage.onChanged.addListener(handler);

		return () => {
			chrome.storage.onChanged.removeListener(handler);
		};
	}, []);

	const setStorage = useCallback((key: StorageKeys, value: unknown) => {
		chrome.storage.local.set({ [key]: value });
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
