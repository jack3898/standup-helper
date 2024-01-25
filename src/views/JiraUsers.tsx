import { useEffect } from 'react';
import { A } from '../components/index.js';
import { useStorage } from '../context/index.js';
import { useFetch } from '../hooks/index.js';

export function JiraUsers(): JSX.Element {
	const { storageData, setStorage } = useStorage();
	const [fetchUsers, users, loading] = useFetch();

	useEffect(() => {
		if (storageData.patToken) {
			fetchUsers(`https://immjsystems.atlassian.net/rest/api/3/search`, {
				headers: {
					Authorization: `Basic ${storageData.patToken}`,
					Accept: 'application/json'
				}
			});
		}
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!users) {
		return <div>No users found</div>;
	}

	return (
		<>
			<header>
				<h2>Now the next steps</h2>
			</header>
			<main>
				<A
					href="#"
					onClick={(e) => {
						e.preventDefault();

						setStorage('patToken', null);
					}}
				>
					Clear token
				</A>
				<code>{JSON.stringify(users, null, 2)}</code>
			</main>
		</>
	);
}
