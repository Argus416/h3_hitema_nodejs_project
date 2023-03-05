import { Role } from "./../Model/MUser";
import User from "../Controller/User";
import { Request, Response } from "express";
import MUser from "../Model/MUser";

class Migration {
	private createUsersOnFirstRun = async () => {
		const is_first_load = await MUser.find();

		if (is_first_load.length === 0) {
			const user_admin = new MUser({
				email: "admin@localhost.com",
				lastname: "localhost",
				firstname: "admin",
				username: "adminH3",
				password: "123321",
				role: Role.admin,
			});

			user_admin.save();
		}

		return is_first_load;
		// const user_admin = User.createUser(req, res);
	};

	createCollections() {
		this.createUsersOnFirstRun();
	}
}

const migration = new Migration();

export default migration;