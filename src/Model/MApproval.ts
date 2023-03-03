import mongoose, { Document, Schema } from "mongoose";

export interface IApproval extends Document{
    id: string;
    dateStart: Date;
    dateEnd: Date;
    price: number;
    cancelled: boolean;
    userId: string;
    modelNumber: string;
}



const MApprovalSchema = new Schema({
    dateStart : Date,
    dateEnd: Date,
    number: Number,
    floor: Number,
    price: Number,
    cancelled: Boolean,
    userId: String,
    modelNumber: String,
}, {
    timestamps: true,
});

export default mongoose.model<IApproval>('Model', MApprovalSchema);

