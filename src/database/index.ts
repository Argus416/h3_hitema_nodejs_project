import mongoose from 'mongoose';
import { DATABASE } from '../config';
import Migration from "./Migration";

const connectDatabase = () => {
	mongoose
		.connect(`mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`)
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.error(err);
		});

	const db = mongoose.connection;

	db.once("connected", async () => {
		console.log("Mongoose connected to db...");
		await Migration.createCollections();
	});

	db.on("error", (err) => {
		console.log(err.message);
	});

	db.on("disconnected", () => {
		console.log("Mongoose connection is disconnected...");
	});
};


export default connectDatabase
