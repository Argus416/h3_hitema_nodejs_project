import { isManager, isConnected, isArtist, uniqueAdmin, isNotAdmin } from "../middleware/checkAuth";
import { isAdmin } from "../middleware/checkAuth";
import express from "express";
import User from "../Controller/User";
import Model from "../Controller/Model";
import Auth from "../Controller/Auth";
// import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post("/login", Auth.login);
router.post("/register", User.createArtist);

router.patch("/logout", Auth.logout);

router.get("/users", User.getAllUsers);
router.post("/user/new", isAdmin, User.createUser);
router.delete("/user/:id", isAdmin, User.deleteUser);
router.patch("/user/banned/:id", isAdmin, User.banUser);
router.patch("/user/:id", User.updateUser);

router.get("/models", Model.getModels);
router.post("/model/new", isNotAdmin, Model.createModel);

router.post("/model/approve/:idModel", isManager, Model.addApproval);

export default router;
