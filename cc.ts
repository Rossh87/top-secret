const rotateChar = (char: string, offset: number) => {
	const charCodeBase = 'a'.charCodeAt(0);

	const currCode = char.charCodeAt(0) - charCodeBase;

	//  if it's not an ascii lowercase letter, don't rotate it.
	if (currCode < 0 || currCode > 26) {
		return char;
	}

	const rotatedCode = (currCode + offset) % 26;

	return String.fromCharCode(rotatedCode + charCodeBase);
};

const cipher = (input: string, offset: number) => {
	let res = '';
	for (let i = 0; i < input.length; i++) {
		res += rotateChar(input[i], offset);
	}
	return res;
};

const getBracketed = (input: string) => {
	const rexp = new RegExp(/\[(.+)\]/);

	return rexp.exec(input)!;
};

const bruteForce = () => {
	const input = Deno.args[0];

	if (typeof input !== 'string') {
		console.error(
			'input should be passed to Deno CLI like this:\ndeno run cc.ts <your-input>'
		);
		Deno.exit(1);
	}

	try {
		const sanitized = getBracketed(atob(input).toLowerCase())[1];

		//   try all possible rotations. Ciphered text sure looks like it ends with an email address, so if we find
		// a rotation that yields a domain at the end, assume it's the correct rotation.
		for (let i = 1; i < 26; i++) {
			const res = cipher(sanitized, i);
			if (res.slice(-4) === 'com.') {
				return res;
			}
		}
	} catch (e) {
		console.error(
			'this script is in no way robust, you should enter CLI arguments EXACTLY in this order:\ndeno cc.ts <your-input>'
		);
		console.error('Original error:\n', e);
		Deno.exit(1);
	}
};

console.log(bruteForce());
