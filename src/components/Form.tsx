export type FormProps = React.ComponentPropsWithoutRef<'form'>;

export function Form({ children, ...props }: FormProps): JSX.Element {
	return <form {...props}>{children}</form>;
}

export type FormTextProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'className'>;

function FormText({ ...props }: FormTextProps): JSX.Element {
	return <input {...props} className="border-2 rounded-md p-2" type="text"></input>;
}

export type FormPasswordProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'className' | 'type'>;

function FormPassword({ ...props }: FormPasswordProps): JSX.Element {
	return <input {...props} className="border-2 rounded-md p-2" type="password"></input>;
}

export type FormLabelProps = Omit<React.ComponentPropsWithoutRef<'label'>, 'className'>;

function FormLabel({ children, ...props }: FormLabelProps): JSX.Element {
	return (
		<label {...props} className="block">
			{children}
		</label>
	);
}

export type FormDescriptionProps = Omit<React.ComponentPropsWithoutRef<'small'>, 'className'>;

function FormDescription({ children, ...props }: FormLabelProps): JSX.Element {
	return (
		<p>
			<small {...props}>{children}</small>
		</p>
	);
}

export type FormButtonProps = React.ComponentPropsWithoutRef<'button'>;

function FormButton({ children, ...props }: FormButtonProps): JSX.Element {
	return (
		<button {...props} className={`border-2 rounded-md p-2 ${props.className ?? ''}`.trimEnd()}>
			{children}
		</button>
	);
}

export type FormErrorProps = {
	children?: string;
} & Omit<React.ComponentPropsWithoutRef<'p'>, 'className' | 'children'>;

function FormError({ children, ...props }: FormErrorProps): JSX.Element {
	if (!children) {
		return <></>;
	}

	return (
		<p {...props} className="text-red-700">
			<small>{children}</small>
		</p>
	);
}

Form.Text = FormText;
Form.Password = FormPassword;
Form.Label = FormLabel;
Form.Description = FormDescription;
Form.Button = FormButton;
Form.Error = FormError;
