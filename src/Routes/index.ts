import { isManger, isConnected, isArtist } from '../middleware/checkAuth';
import { isAdmin } from '../middleware/checkAuth';
import express from "express";
import User from "../Controller/User";
import Model from "../Controller/Model";
import Approval from "../Controller/Approval";
import Auth from "../Controller/Auth";
// import authenticate from '../middleware/authenticate';

const router = express.Router();


router.post("/login" , Auth.login);
// router.post("/register" , Auth.login);

router.patch("/logout", Auth.logout);

router.get("/users", User.getAllUsers);
router.post("/user/new",isAdmin, User.createUser);
router.delete("/user/:id", User.deleteUser);
router.patch("/user/:id", User.updateUser);

export default router;