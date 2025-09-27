import { Router } from "express";
import passport from "passport";
import { requireRole } from "../middlewares/authorize.js";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = Router();

// Lectura pública
router.get("/", getProducts);
router.get("/:pid", getProductById);

// Mutaciones: admin only
router.post("/", passport.authenticate("current", { session: false }), requireRole("admin"), createProduct);
router.put("/:pid", passport.authenticate("current", { session: false }), requireRole("admin"), updateProduct);
router.delete("/:pid", passport.authenticate("current", { session: false }), requireRole("admin"), deleteProduct);

export default router;
