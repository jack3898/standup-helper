import { PatForm } from './PatForm.js';
import { H1 } from './components/index.js';
import { StorageProvider } from './context/index.js';

export function App(): JSX.Element {
	return (
		<StorageProvider>
			<div className="p-4">
				<header>
					<H1>Jira Standup Helper</H1>
				</header>
				<main>
					<PatForm />
				</main>
			</div>
		</StorageProvider>
	);
}
