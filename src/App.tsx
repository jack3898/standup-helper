import { PatForm } from './PatForm.js';
import { Form, H1 } from './components/index.js';

export function App(): JSX.Element {
	return (
		<div className="p-4">
			<header>
				<H1>Jira Standup Helper</H1>
			</header>
			<main>
				<p></p>
				<Form>
					<PatForm />
				</Form>
			</main>
		</div>
	);
}
