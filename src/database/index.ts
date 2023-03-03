import mongoose from 'mongoose';
import { DATABASE } from '../config';

const connectDatabase = () =>{
    mongoose.connect(`mongodb://${DATABASE.HOST}:${DATABASE.PORT}/${DATABASE.NAME}`).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error(err);
    });

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to db...');
      });
    
    mongoose.connection.on('error', err => {
        console.log(err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection is disconnected...');
    });
    
}


export default connectDatabase
