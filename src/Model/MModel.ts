import mongoose, { Document, Schema } from 'mongoose';

export interface MModel {
	id?: string;
	lastname: string;
	firstname: string;
	username: string;
	password: string;
}



const ModelSchema = new Schema({
    title: String,
    nom: String,
    slug: {
        type: String,
        unique: true
    },
    // check if we can relate to a user
    artistId: String,
    
}, {
    timestamps: true,
});

export default mongoose.model<MModel>("Model", ModelSchema);
