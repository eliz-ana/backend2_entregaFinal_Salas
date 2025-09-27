import { Router } from "express";   
import{ getUsers ,getUserById, updateUser, deleteUser,createUser} from "../controllers/user.controller.js";
import { validateObjectId,validateCreateUserBody,validateUpdateUserBody } from "../middlewares/validateUser.js";

const router= Router();

router.get("/", getUsers);
router.get("/:uid", validateObjectId, getUserById);
router.post("/", validateCreateUserBody, createUser);
router.put("/:uid", validateObjectId, validateUpdateUserBody, updateUser);
router.delete("/:uid", validateObjectId, deleteUser);



export default router;