import { createUsername } from '../helpers/formater';
import {Request, Response} from 'express';
import MUser, {IUser, Role} from "../Model/MUser";
import _ from "lodash"
import { StatusCodes } from 'http-status-codes';


class User {

    users: Array<any> = []

    createUser = async (req: Request, res: Response) => {
        try{

            const user = new MUser({...req.body})
            await user.save()
            
            res.json({data: user});
        }catch(err){
            console.error(`Error creating user ${err}`)
            res.status(StatusCodes.UNAUTHORIZED).send(`Error creating user ${err}`)

        }
    }

    /*
        On retourne la liste des utilisateurs (this.users)
     */
    getAllUsers = async (req: Request, res: Response) => {
        try{
            const users = await MUser.find()
            res.json({ data : users })
        }catch(err){
            console.error(`Error fetching users ${err}`)
            res.status(StatusCodes.UNAUTHORIZED).send(`Error fetching users ${err}`)
        }
    }

    /*
       On supprime un utilisateur de la liste des utilisateurs (this.users) en fonction de son id
     */
    deleteUser = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const user = await MUser.deleteOne({
                _id : id
            })
    
            res.json({user});
        }catch(err){
            console.error(`Error deleting user ${err}`)
            res.status(StatusCodes.UNAUTHORIZED).send(`Error deleting user ${err}`)
        }
    }

    /*
        On met à jour un utilisateur de la liste des utilisateurs (this.users) en fonction de son id
     */
    updateUser = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const user = await MUser.updateOne({_id: id}, {
                ...req.body
            })

            res.json(user)
        }catch(err){
            console.error(`Error updating user ${err}`)
            res.status(StatusCodes.NOT_FOUND).send(`User not found ${err}`);
        }

    }
}

const user = new User();

export default user;