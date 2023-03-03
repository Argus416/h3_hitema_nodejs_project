import {Request, Response} from 'express';
import _ from "lodash"
import MModel, { IModel } from "../Model/MModel";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Auth from "./Auth";
import { Role } from "../Model/MUser";

class Model {
	models: Array<IModel> = [];

	createModel = async (req: Request, res: Response) => {
		try {
			const model = new MModel({ ...req.body });
			await model.save();
			res.json({ data: model });
		} catch (err) {
			console.error(`Error creating model ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error creating model ${err}`);
		}
	};

	getModels = async (req: Request, res: Response) => {
		try {
			let models: IModel[] = [];

			if (Auth.currentUser?.role === Role.admin || Auth.currentUser?.role === Role.manager) {
				models = await MModel.find();
			}

			if (Auth.currentUser?.role === Role.artist) {
				models = await MModel.find({
					artistId: Auth.currentUser._id,
				});
			}

			res.json({ data: models });
		} catch (err) {
			console.error(`Error fetching models ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error fetching models ${err}`);
		}
	};

	/*
       On supprime un utilisateur de la liste des utilisateurs (this.models) en fonction de son id
     */
	deleteModel = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const model = await MModel.deleteOne({
				_id: id,
			});

			res.json({ model });
		} catch (err) {
			console.error(`Error deleting model ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error deleting model ${err}`);
		}
	};

	updateModel = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const model = await MModel.updateOne(
				{
					_id: id,
					artistId: Auth.currentUser._id,
					banned: false,
				},
				{
					...req.body,
				}
			);

			res.json(model);
		} catch (err) {
			console.error(`Error updating model ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error updating model ${err}`);
		}
	};

	addApproval = async (req: Request, res: Response) => {
		try {
			const { idModel } = req.params;
			const model = await MModel.updateOne(
				{
					_id: idModel,
					banned: false,
				},
				{
					$push: {
						approvals: {
							...req.body,
						},
					},
				}
			);

			res.json(model);
		} catch (err) {
			console.error(`Error approving model ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error approving model ${err}`);
		}
	};
}

const model = new Model();

export default model;
