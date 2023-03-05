import mongoose, { Document, Schema } from "mongoose";

export interface Approvals {
	userId: string;
	approved: boolean;
	created_at: Date;
}

export interface IModel {
	id?: string;
	title: string;
	name: string;
	slug: string;
	artistId: string;
	approvals: Approvals[];
}

const ModelSchema = new Schema(
	{
		title: String,
		name: String,
		slug: {
			type: String,
			unique: true,
		},
		// check if we can relate to a user
		artistId: Schema.Types.ObjectId,
		approvals: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
				},
				approved: Boolean,
				comment: String,
				created_at: Date,
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IModel>("Model", ModelSchema);
