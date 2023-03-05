import express, { Application } from 'express';
import Routes from "../routes/index";
import authenticate from "../middleware/authenticate";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(authenticate);


app.use('/', Routes);

export default app 
