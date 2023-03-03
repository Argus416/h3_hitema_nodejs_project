import { NextFunction, Request, Response } from "express"
import Auth from "../Controller/Auth"
import { Role } from "../Model/MUser"
import _ from "lodash"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

export const isConnected = (req: Request,res: Response,next: NextFunction) =>{
    const connected = _.isEmpty(Auth.currentUser)    
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


export const isArtist = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.artist
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}


export const isManger = (req: Request,res: Response,next: NextFunction) =>{
    const result =Auth.currentUser?.role === Role.manager
    if(result)
        next()
    else{
        res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED)
    }
}