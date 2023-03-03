import express, { Application } from 'express';
import Routes from '../Routes/index';
import {JWT_SECRET} from "../config/index"
import authenticate from '../middleware/authenticate';



const app: Application = express();

app.use(express.json());
// app.use(
//     jwt({
//         secret: JWT_SECRET,
//         algorithms: ['HS256'],
//     }).unless({ path: ['/login'] })
// );

app.use(authenticate);




app.use('/', Routes);

export default app 
