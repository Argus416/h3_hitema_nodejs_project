import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config";

var { expressjwt: jwt } = require("express-jwt");

export default jwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    getToken: function (req: Request, res: Response, next: NextFunction) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      return null;
    },
    
}).unless({ path: ['/login'] });