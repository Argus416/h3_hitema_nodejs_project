import mongoose, { Document, Schema } from 'mongoose';

export interface IModel {
	id?: string;
	title: string;
	name: string;
	slug: string;
	artistId: string;
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
		artistId: String,
		approvals: [
			{
				userId: Schema.Types.ObjectId,
				approuved: Boolean,
				created_at: Date,
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IModel>("Model", ModelSchema);
