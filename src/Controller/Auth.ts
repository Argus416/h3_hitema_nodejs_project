import { comparePassword } from "./../services/hashServices";
import { Request, Response } from "express";
import MUser, { IUser } from "../model/MUser";
import { JWT_SECRET } from "../config";

import jwt from "jsonwebtoken";

class Auth {
	public login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const user = (await MUser.findOne({
			email,
		})) as IUser;
		const isSamePassword = await comparePassword(password, user.password as string);

		if (user) {
			if (isSamePassword) {
				const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: "1h" });
				res.cookie("token", token);
				res.json({ text: "User connected", token });
			} else {
				res.json({ text: "Wrong password" });
			}
		} else {
			res.json({ text: "User not found" });
		}
	};

	public logout = (req: Request, res: Response) => {
		(req as any).user = {} as IUser;
		res.json({ text: "User disconnected" });
	};
}

const auth = new Auth();

export default auth;
