import { Request, Response } from "express";
import _ from "lodash";
import MModel, { IModel } from "../model/MModel";

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Auth from "./Auth";
import MUser, { Role } from "../model/MUser";

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
			let models = await MModel.aggregate([
				{
					$match: {
						slug: req.params.slug,
					},
				},
				{
					$unwind: {
						path: "$approvals",
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "approvals.userId",
						foreignField: "_id",
						as: "all_users_approvals",
					},
				},
				{
					$unwind: {
						path: "$all_users_approvals",
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "artistId",
						foreignField: "_id",
						as: "artist",
					},
				},
				{
					$unwind: {
						path: "$artist",
					},
				},
				{
					$group: {
						_id: "$_id",
						artistId: { $first: "$artistId" },
						name: { $first: "$name" },
						slug: { $first: "$slug" },
						artist: {
							$first: {
								_id: "$artist._id",
								username: "$artist.username",
								firstname: "$artist.firstname",
								lastname: "$artist.lastname",
								role: "$artist.role",
								createdAt: "$artist.createdAt",
								updatedAt: "$artist.updatedAt",
							},
						},
						approvals: {
							$push: {
								userId: "$all_users_approvals._id",
								username: "$all_users_approvals.username",
								firstname: "$all_users_approvals.firstname",
								lastname: "$all_users_approvals.lastname",
								approved: "$approvals.approved",
							},
						},
					},
				},
			]);

			const nbManager = await MUser.find({ role: Role.manager, banned: false }).countDocuments();

			res.json({ models: models, nbManager: nbManager });
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
