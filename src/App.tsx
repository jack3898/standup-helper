import { StrictMode } from 'react';
import { ViewRenderer } from './ViewRenderer.js';
import { StorageProvider } from './context/index.js';

export function App(): JSX.Element {
	return (
		<StrictMode>
			<StorageProvider>
				<div className="p-4 min-w-96">
					<ViewRenderer />
				</div>
			</StorageProvider>
		</StrictMode>
	);
}
