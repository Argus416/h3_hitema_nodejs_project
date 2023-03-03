import {Request, Response} from 'express';
import { IApproval } from "../Model/MApproval";
import * as crypto from "crypto";
import User from "./User";
import Model from "./Model";

class Approval {

    approvals: Array<any> = []

    createApproval = (req: Request, res: Response) => {
        const approval: IApproval = {
            id: crypto.randomUUID(),
            ...req.body
        };

        this.approvals.push(approval);
        res.json({text: "Approval created"});

    }

    createRandomApproval = (req: Request, res: Response) => {
        const approvals = {
            id: crypto.randomUUID(),
            dateStart: new Date(),
            dateEnd: new Date(),
            price: 500,
            cancelled: false,
            userId: User.users[0]?.id ?? 'no-selected-user',
            modelNumber: Model.models[0]?.id ?? 'no-selected-model'
        };


        this.approvals.push(approvals);
        res.json({text: "Approvals created"});

    }

    getAllapprovals = (req: Request, res: Response) => {
        res.json(this.approvals);
    }

    deleteApproval = (req: Request, res: Response) => {
        const id = req.params.id;
        const approval = this.approvals.find(p => p.id === id);
        if (approval) {
            this.approvals = this.approvals.filter(p => p.id !== id);
            res.json({text: "Approval deleted"});
        } else {
            res.status(404).json({text: "Approval not found"});
        }
    }

    updateApproval = (req: Request, res: Response) => {
        const id = req.params.id;
        const approval = this.approvals.find(p => p.id === id);
        if (approval) {
            this.approvals = this.approvals.map(p => p.id === id ? {...p, ...req.body} : p);
            res.json({text: "Approval updated"});
        } else {
            res.status(404).json({text: "Approval not found"});
        }
    }


    cancelApproval = (req: Request, res: Response) => {
        const id = req.params.id;
        const approval = this.approvals.find(p => p.id === id);
        if(approval?.cancelled === true){
            res.json({text: "Approval already canceled"});
        }
        if (approval) {
            this.approvals = this.approvals.map(p => p.id === id ? {...p, cancelled: true} : p);
            res.json({text: "Approval canceled"});
        } else {
            res.status(404).json({text: "Approval not found"});
        }
    }
}

const approval = new Approval();

export default approval;
