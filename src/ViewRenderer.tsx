import { useStorage } from './context/index.js';
import { JiraUsers } from './views/JiraUsers.js';
import { PatForm } from './views/index.js';

export function ViewRenderer(): JSX.Element {
	const { storageData } = useStorage();

	if (!storageData.patToken) {
		return <PatForm />;
	}

	if (storageData.patToken) {
		return <JiraUsers />;
	}

	return (
		<div>
			<p>Hmmm, you shouldn't be seeing this. Tell Jack to fix it. 😂</p>
		</div>
	);
}
