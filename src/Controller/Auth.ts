import { comparePassword } from "./../services/hashServices";
import { Request, Response } from "express";
import MUser, { IUser } from "../model/MUser";
import { JWT_SECRET } from "../config";

import jwt from "jsonwebtoken";

class Auth {
	currentUser = {} as any;

	public login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		this.currentUser = await MUser.findOne({
			email,
		});
		const isSamePassword = await comparePassword(password, this.currentUser.password);

		if (this.currentUser) {
			if (isSamePassword) {
				const token = jwt.sign({ id: this.currentUser.id }, JWT_SECRET, { expiresIn: "1h" });
				res.json({ text: "User connected", token });
			} else {
				res.json({ text: "Wrong password" });
			}
		} else {
			res.json({ text: "User not found" });
		}
	};

	public logout = (req: Request, res: Response) => {
		this.currentUser = {} as IUser;
		res.json({ text: "User disconnected" });
	};
}

const auth = new Auth();

export default auth;
