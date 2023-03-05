import { NextFunction, Request, Response } from "express"
import Auth from "../controller/Auth";
import { Role } from "../model/MUser";
import _ from "lodash"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

export const isConnected = (req: Request,res: Response,next: NextFunction) =>{
    const connected = _.isEmpty(Auth.currentUser);    
    if(connected){
        next()
    }else{
        res.status(402).json({message : 'Already connected'})
    }
}

export const isAdmin = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.admin 
    if(result){
        next()
    }
    else{
        res.status(StatusCodes.UNAUTHORIZED).send("You have to be an admin to access this route");
    }
}


export const isNotAdmin = (req: Request, res: Response, next: NextFunction) => {
	const result = Auth.currentUser?.role === Role.admin;
	if (result) {
		res.status(StatusCodes.UNAUTHORIZED).send("You are not allowed to access this route");
	} else {
		next();
	}
};

export const isArtist = (req: Request, res: Response, next: NextFunction) => {
	const result = Auth.currentUser?.role === Role.artist;
	if (result) next();
	else {
		res.status(StatusCodes.UNAUTHORIZED).send("You have to be an artist to access this route");
	}
};

export const isManager = (req: Request, res: Response, next: NextFunction) => {
	const result = Auth.currentUser?.role === Role.manager;
	if (result) next();
	else {
		res.status(StatusCodes.UNAUTHORIZED).send("You have to be a manager to access this route");
	}
};
