import { ViewRenderer } from './ViewRenderer.js';
import { StorageProvider } from './context/index.js';

export function App(): JSX.Element {
	return (
		<StorageProvider>
			<div className="p-4">
				<ViewRenderer />
			</div>
		</StorageProvider>
	);
}
