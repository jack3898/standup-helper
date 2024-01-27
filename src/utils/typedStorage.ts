import { type ZodType, type z } from 'zod';

export class TypedStorage<T extends Record<K, ZodType>, K extends keyof T> {
	constructor(private schemas: T) {}

	private getSchema(key: K): T[K] {
		const schemaShape = this.schemas;
		const potentialSchema = schemaShape[key];

		if (!potentialSchema) {
			throw new ReferenceError(`No schema found for key ${key.toString()}`);
		}

		return potentialSchema;
	}

	get(key: K): Promise<z.infer<T[K]>> {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get((result) => {
				const schema = this.getSchema(key);
				const validatedValue = schema.safeParse(result[key.toString()]);

				if (!validatedValue.success) {
					reject(`Error getting key ${key.toString()}\n${validatedValue.error}\n`);
					return;
				}

				resolve(validatedValue.data);
			});
		});
	}

	async set(key: K, value: unknown): Promise<z.infer<T[K]>> {
		const schema = this.getSchema(key);
		const validatedValue = await schema.safeParseAsync(value);

		if (!validatedValue.success) {
			throw validatedValue.error;
		}

		await chrome.storage.local.set({ [key]: value });

		return validatedValue.data;
	}

	/**
	 * Sets a new value if the key does not exist yet. Otherwise, returns the existing value.
	 */
	async setNew(key: K, value: unknown): Promise<z.infer<T[K]>> {
		const existingKey = await this.get(key);

		if (existingKey) {
			return existingKey;
		}

		return this.set(key, value);
	}

	remove<K extends keyof T>(key: K): Promise<void> {
		return chrome.storage.local.remove(key.toString());
	}
}
