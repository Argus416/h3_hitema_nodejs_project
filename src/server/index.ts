import express, { Application } from 'express';
import Routes from "../routes/index";
import authenticate from "../middleware/authenticate";

const app: Application = express();

app.use(express.json());

app.use(authenticate);




app.use('/', Routes);

export default app 
