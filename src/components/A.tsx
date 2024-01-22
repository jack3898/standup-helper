export type AProps = {
	children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<'a'>, 'className'>;

export function A({ ...props }: AProps): JSX.Element {
	return <a {...props} className="text-blue-700" />;
}
