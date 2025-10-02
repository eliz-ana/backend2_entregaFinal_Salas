import { Router } from "express";
import passport from "passport";
import { register, login, currentSession } from "../controllers/session.controller.js";
import { forgotPassword, resetPassword} from "../controllers/password.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

router.get("/current", passport.authenticate("current", { session: false }), currentSession);

export default router;