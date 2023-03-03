import mongoose, { Document, Schema } from 'mongoose';

export interface IUser   {
    id ?: string,
    email : string,
    lastname: string,
    firstname: string,
    username : string,
    password: string,
    role: Role,
}

export enum Role {
    admin = "admin",
    manager = "manager",
    artist = "artist"
}

// Admin can 
    // CRD all models
    // ban artist

// Manager can
    // read all models
    // approbation of a model 

// Artist can
    // read for his own account, update all models


const UserSchema = new Schema({
    lastname: String,
    firstname: String,
    email : String,
    username : {
        type: String, 
        unique: true
    },
    password: String,
    role: String,
}, {
    timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
