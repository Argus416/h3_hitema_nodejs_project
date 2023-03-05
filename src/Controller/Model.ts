import { Request, Response } from "express";
import _ from "lodash";
import MModel, { IModel } from "../model/MModel";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Auth from "./Auth";
import MUser, { Role } from "../model/MUser";
import { ModelService } from "../services/Model";

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

	getModel = async (req: Request, res: Response) => {
		try {
			let model: IModel | IModel[] = (await ModelService.getModels(req.params.slug)) as IModel[];
			model = model[0] as IModel;

			if (model) {
				const modelIsValid = await ModelService.isModelValid(model._id as string);

				res.json({ model });
			} else {
				res.status(StatusCodes.NOT_FOUND).send("Model not found");
			}
		} catch (err) {
			console.error(`Error fetching models ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error fetching models ${err}`);
		}
	};

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
					"approvals.userId": { $nin: Auth.currentUser._id },
				},
				{
					$push: {
						approvals: {
							userId: Auth.currentUser._id,
							...req.body,
						},
					},
				}
			);

			res.status(StatusCodes.OK).send("Model approved successfully");
		} catch (err) {
			console.error(`Error approving model ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error approving model ${err}`);
		}
	};

	removeApproval = async (req: Request, res: Response) => {
		try {
			const { idModel } = req.params;

			const isApproved = await MModel.findOne({
				_id: idModel,
				"approvals.userId": { $in: Auth.currentUser._id },
			});

			if (isApproved) {
				const model = await MModel.updateOne(
					{
						_id: idModel,
					},
					{
						$pull: {
							approvals: {
								userId: Auth.currentUser._id,
							},
						},
					}
				);
				res.status(StatusCodes.OK).send("Approval removed successfully");
			} else {
				res.status(StatusCodes.NOT_FOUND).json("Error, no approval found to remove");
			}
		} catch (err) {
			console.error(`Error approving model ${err}`);
			res.status(StatusCodes.UNAUTHORIZED).send(`Error removing model ${err}`);
		}
	};
}

const model = new Model();

export default model;
