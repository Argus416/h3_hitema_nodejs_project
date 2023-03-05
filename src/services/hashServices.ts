import bcrypt from "bcrypt";

const saltRounds = 12;

export const hashPassword = async (password: string): Promise<boolean> => {
	return bcrypt.hash(password, saltRounds).then((hash) => {
		return hash;
	});
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
	return bcrypt.compare(password, hashedPassword).then((result) => {
		return result;
	}) as boolean;
};
