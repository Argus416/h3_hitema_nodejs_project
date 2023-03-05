import { hashPassword } from "./../services/hashServices";
import { Role } from "../model/MUser";
import User from "../controller/User";
import { Request, Response } from "express";
import MUser from "../model/MUser";
import { faker } from "@faker-js/faker";
import _ from "lodash";

async function createUser(nb: number, role: Role) {
	for await (const index of _.range(1, nb + 1)) {
		const user = new MUser({
			email: faker.internet.email(),
			lastname: faker.name.lastName(),
			firstname: faker.name.firstName(),
			username: `${role}${index === 1 ? "" : index}`,
			password: await hashPassword("123321"),
			role: role,
		});
		await user.save();
	}
}

class Migration {
	private createUsersOnFirstRun = async () => {
		try {
			const is_first_load = await MUser.find();
			if (is_first_load.length === 0) {
				await Promise.all([await createUser(1, Role.admin), await createUser(10, Role.artist), await createUser(3, Role.manager)]).then(() => {
					console.log("Users created");
					return true;
				});
			}
		} catch (err) {
			console.error(err);
		}
	};

	async createCollections() {
		await this.createUsersOnFirstRun();
	}
}

const migration = new Migration();

export default migration;
