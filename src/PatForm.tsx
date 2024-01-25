import { useFormik } from 'formik';
import { A, Form } from './components/index.js';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { storageZodSchema, useStorage } from './context/storage.js';

export function PatForm(): JSX.Element {
	const { storageData, setStorage } = useStorage();

	const { handleSubmit, getFieldProps, errors } = useFormik({
		initialValues: {
			patToken: ''
		},
		onSubmit(values) {
			setStorage('patToken', values.patToken);
		},
		validationSchema: toFormikValidationSchema(storageZodSchema)
	});

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Form.Label htmlFor="patToken">Personal Access Token</Form.Label>
				<Form.Password id="patToken" {...getFieldProps('patToken')} />
				<Form.Error>{errors.patToken}</Form.Error>
				<Form.Description>
					You can find your PAT token in your{' '}
					<A href="https://id.atlassian.com/manage-profile/security/api-tokens">Atlassian account settings</A>.
				</Form.Description>
				<Form.Button type="submit">Save</Form.Button>
			</Form>
			{JSON.stringify(storageData)}
		</>
	);
}
