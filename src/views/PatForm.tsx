import { Form, H1 } from '../components/index.js';
import { useCallback } from 'react';
import { useStorage } from '../context/index.js';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';

export function PatForm(): JSX.Element {
	const { storageData } = useStorage();

	const startOAuthFlow = useCallback(
		(clientId: string, clientSecret: string) => {
			if (!storageData.csrfState) {
				throw new Error('No CSRF state found in storage. Required for OAuth flow.');
			}

			const authUrl = new URL('https://auth.atlassian.com/authorize');

			authUrl.searchParams.append('audience', 'api.atlassian.com');
			authUrl.searchParams.append('client_id', 'Hsk3b8MHqemdpCLikIOrgYNOzUBhYBiL');
			authUrl.searchParams.append('scope', 'read:me read:account');
			authUrl.searchParams.append('redirect_uri', 'https://e0162dd5-1bfe-4467-a88d-dc00315e542f.mock.pstmn.io');
			authUrl.searchParams.append('state', storageData.csrfState);
			authUrl.searchParams.append('response_type', 'code');
			authUrl.searchParams.append('prompt', 'consent');

			chrome.identity.launchWebAuthFlow(
				{
					url: authUrl.toString(),
					interactive: true
				},
				(responseUrl) => {
					if (!responseUrl) {
						throw new Error('No response URL received from OAuth flow.');
					}

					const urlInstance = new URL(responseUrl);
					const code = urlInstance.searchParams.get('code');

					if (!code) {
						throw new Error('No code found in response URL.');
					}

					const csrfState = urlInstance.searchParams.get('state');

					if (!csrfState) {
						throw new Error('No CSRF state found in response URL.');
					}

					if (csrfState !== storageData.csrfState) {
						throw new Error('CSRF state mismatch.');
					}

					fetch('https://auth.atlassian.com/oauth/token', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							grant_type: 'authorization_code',
							client_id: clientId,
							client_secret: clientSecret,
							code,
							redirect_uri: '{{MOCK_URL}}'
						})
					});
				}
			);
		},
		[storageData.csrfState]
	);

	const { handleSubmit, errors, getFieldProps, isValid, dirty } = useFormik({
		initialValues: {
			clientId: '',
			clientSecret: ''
		},
		onSubmit: ({ clientId, clientSecret }) => {
			startOAuthFlow(clientId, clientSecret);
		},
		validationSchema: toFormikValidationSchema(
			z.object({
				clientId: z.string(),
				clientSecret: z.string()
			})
		)
	});

	return (
		<>
			<header>
				<H1>Jira Standup Helper</H1>
			</header>
			<main>
				<p>Seems you're not logged in to Jira. Let's fix that!</p>
				<em>I'll add helpful instructions later.</em>
				<Form onSubmit={handleSubmit}>
					<Form.Label>Client ID</Form.Label>
					<Form.Text type="text" {...getFieldProps('clientId')} />
					<Form.Error>{errors.clientId}</Form.Error>
					<Form.Label>Client Secret</Form.Label>
					<Form.Password {...getFieldProps('clientSecret')} />
					<Form.Error>{errors.clientSecret}</Form.Error>
					<Form.Hr />
					<Form.Button type="submit" disabled={!isValid || !dirty}>
						Log in with Jira
					</Form.Button>
				</Form>
			</main>
		</>
	);
}
