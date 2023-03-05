import {isManager, isConnected, isArtist, uniqueAdmin} from '../middleware/checkAuth';
import { isAdmin } from '../middleware/checkAuth';
import express from "express";
import User from "../Controller/User";
import Model from "../Controller/Model";
import Approval from "../Controller/Approval";
import Auth from "../Controller/Auth";
// import authenticate from '../middleware/authenticate';

const router = express.Router();


router.post("/login" , Auth.login);
router.post("/register" , User.createArtist);

router.patch("/logout", Auth.logout);

router.get("/users", User.getAllUsers);
router.post("/user/new", isAdmin, uniqueAdmin, User.createUser);
router.delete("/user/:id", User.deleteUser);
router.patch("/user/:id", User.updateUser);

router.post('/model', isArtist, Model.createModel)
export default router;