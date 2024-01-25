export type Result<T, E> =
	| {
			success: false;
			error: E;
	  }
	| ({
			success: true;
	  } & T);
