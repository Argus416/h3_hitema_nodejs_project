import { Role } from "./../model/MUser";
import MModel, { IModel } from "../model/MModel";
import MUser from "../model/MUser";
import { isDocumentValid } from "../helpers/methods";

export class ModelService {
	static getModels = async (slug: string): Promise<IModel[] | false> => {
		try {
			const model = await MModel.aggregate([
				{
					$match: {
						slug: slug,
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
								comment: "$approvals.comment",
							},
						},
					},
				},
			]);

			return model;
		} catch (err) {
			console.error(`Error fetching model ${err}`);
			return false;
		}
	};

	static isModelValid = async (id: string): Promise<boolean> => {
		const nbManager = await MUser.find({ role: Role.manager, banned: false }).countDocuments();
		const model = await MModel.findById(id);

		if (model) {
			const allVotes = model.approvals.map((approval) => {
				return approval.approved;
			});
			const allManagersVoted = allVotes.length === nbManager;
			const isModelValid = isDocumentValid(allVotes);

			console.log({ allManagersVoted, allVotes, isModelValid });

			if (isModelValid) {
				return true;
			}
		}

		return false;
	};
}
