import { Request, Response } from "express";
import MUser, { Role } from "../model/MUser";
import _ from "lodash";
import { StatusCodes } from "http-status-codes";
import { hashPassword } from "../services/hashServices";

class User {
	users: Array<any> = [];

	getAllUsers = async (req: Request, res: Response) => {
		try {
			const users = await MUser.find();
			res.json({ data: users });
		} catch (err) {
			console.error(`Error fetching users ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error fetching users ${err}`);
		}
	};

	deleteUser = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const user = await MUser.deleteOne({
				_id: id,
			});

			res.status(StatusCodes.OK).send("User deleted");
		} catch (err) {
			console.error(`Error deleting user ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error deleting user ${err}`);
		}
	};

	updateUser = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!_.isEmpty(req.body.password)) {
				req.body.password = await hashPassword(req.body.password);
			}

			const user = await MUser.updateOne(
				{ _id: id },
				{
					...req.body,
				}
			);

			res.status(StatusCodes.OK).json("User updated");
		} catch (err) {
			console.error(`Error updating user ${err}`);
			res.status(StatusCodes.NOT_FOUND).send(`User not found ${err}`);
		}
	};

	createArtist = async (req: Request, res: Response) => {
		try {
			console.log({
				password: req.body.password,
				hashPassword: await hashPassword(req.body.password),
			});

			const user = new MUser({
				...req.body,
				password: await hashPassword(req.body.password),
				role: Role.artist,
			});

			await user.save();

			const response = _.cloneDeep(req.body);
			delete response.password;

			res.status(StatusCodes.OK).send("User created");
		} catch (err) {
			console.error(`Error creating user ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error creating user ${err}`);
		}
	};

	createManager = async (req: Request, res: Response) => {
		try {
			const user = new MUser({
				...req.body,
				password: await hashPassword(req.body.password),
				role: Role.manager,
			});
			await user.save();

			const response = _.cloneDeep(req.body);
			delete response.password;

			res.json({ data: response });
		} catch (err) {
			res.status(StatusCodes.OK).send("Manager created");
			res.status(StatusCodes.UNAUTHORIZED).send(`Error creating user ${err}`);
		}
	};

	banUser = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			const user = await MUser.findById(id);

			if (user?.role !== Role.artist) {
				res.status(StatusCodes.METHOD_NOT_ALLOWED).send(`User is not an artist`);
				return;
			}

			const userAfterUpdate = await MUser.updateOne(
				{ _id: id },
				{
					banned: true,
				}
			);

			res.status(StatusCodes.OK).json("User banned");
		} catch (err) {
			console.error(`Error updating user ${err}`);
			res.status(StatusCodes.NOT_FOUND).send(`User not found ${err}`);
		}
	};
}

const user = new User();

export default user;
