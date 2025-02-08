import * as bcrypt from 'bcrypt';

export const generateToken = () => {
	const seed = Math.floor(1000 + Math.random() * 9000).toString();

	return bcrypt.hashSync(seed, 12);
};
