import { NextFunction, Request, Response } from "express"
import Auth from "../Controller/Auth"
import { Role } from "../Model/MUser"
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
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}

export const uniqueAdmin = (req: Request,res: Response,next: NextFunction) =>{
    const result = req.body.role === Role.admin
    if(result){
        res.status(StatusCodes.UNAUTHORIZED).send("Only one admin is allowed")
    }
    else{
        next()
    }
}
export const isNotAdmin = (req: Request, res: Response, next: NextFunction) => {
	const result = Auth.currentUser?.role === Role.admin;
	if (result) {
		res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
	} else {
		next();
	}
};


export const isArtist = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.artist
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}


export const isManager = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.manager
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}
