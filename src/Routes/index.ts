import { isManager, isConnected, isArtist, isNotAdmin } from "../middleware/checkAuth";
import { isAdmin } from "../middleware/checkAuth";
import express from "express";
import User from "../controller/User";
import Model from "../controller/Model";
import Auth from "../controller/Auth";
// import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post("/login", Auth.login);
router.post("/register/artist", User.createArtist);
router.post("/register/manager", isAdmin, User.createManager);

router.patch("/logout", Auth.logout);

router.get("/users", User.getAllUsers);
router.get("/user/banned/:id", isAdmin, User.banUser);
router.patch("/user/:id", isAdmin || isManager, User.updateUser);
router.delete("/user/:id", isAdmin, User.deleteUser);

router.get("/models", Model.getModels);
router.get("/model/:slug", Model.getModel);
router.post("/model/new", isNotAdmin, Model.createModel);

router.patch("/model/approve/add/:idModel", isManager, Model.addApproval);
router.delete("/model/approve/remove/:idModel", isManager, Model.removeApproval);

export default router;
