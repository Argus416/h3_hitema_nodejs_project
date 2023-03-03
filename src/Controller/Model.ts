import {Request, Response} from 'express';
import _ from "lodash"
import MModel from '../Model/MModel';

import {
	ReasonPhrases,
	StatusCodes,
} from 'http-status-codes';


class Model {

    models: Array<any> = []

    createModel = async (req: Request, res: Response) => {
        try{
            const model = new MModel({...req.body})
            await model.save()
            res.json({data: model});
        }catch(err){
            console.error(`Error creating model ${err}`)
            res.status(StatusCodes.UNAUTHORIZED).send(`Error creating model ${err}`)
        }
    }

    getAllModels = async (req: Request, res: Response) => {
        try{
            const models = await MModel.find()
            res.json({ data : models })
        }catch(err){
            console.error(`Error fetching models ${err}`)
            res.status(StatusCodes.UNAUTHORIZED).send(`Error fetching models ${err}`)
        }
    }

    /*
       On supprime un utilisateur de la liste des utilisateurs (this.models) en fonction de son id
     */
    deleteModel = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const model = await MModel.deleteOne({
                _id : id
            })
    
            res.json({model});
        }catch(err){
            console.error(`Error deleting model ${err}`)
            res.status(StatusCodes.UNAUTHORIZED).send(`Error deleting model ${err}`)
        }
    }

    /*
        On met à jour un utilisateur de la liste des utilisateurs (this.models) en fonction de son id
     */
    updateModel = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const model = await MModel.updateOne({_id: id}, {
                ...req.body
            })

            res.json(model)
        }catch(err){
            console.error(`Error updating model ${err}`)
            res.status(StatusCodes.UNAUTHORIZED).send(`Error updating model ${err}`)
        }

    }
}

const model = new Model();

export default model;
