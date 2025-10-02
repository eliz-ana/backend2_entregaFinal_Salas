import { Router } from "express";
import passport from "passport";
import { requireRole } from "../middlewares/authorize.js";
import mongoose from "mongoose";
import {
  createCart,
  getCart,
  addProductToCart,
  setProductQuantity,
  removeProductFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { purchaseCart } from "../controllers/cart.controller.js";

const router = Router();

// Helper local: validar ObjectId (reutilizalo si lo tenés global)
function validateObjectId(paramName) {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `Invalid ${paramName}` });
    }
    next();
  };
}

// Crear carrito (user logueado)
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  requireRole("user"),
  createCart
);

// Obtener carrito 
router.get(
  "/:cid",
  passport.authenticate("current", { session: false }),
  requireRole("user"),
  validateObjectId("cid"),
  getCart
);

// Agregar producto (user)
router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  requireRole("user"),
  validateObjectId("cid"),
  validateObjectId("pid"),
  addProductToCart
);
// Comprar carrito (user)
router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  requireRole("user"),
  validateObjectId("cid"),
  purchaseCart
);

// Setear cantidad (user)
router.put(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  requireRole("user"),
  validateObjectId("cid"),
  validateObjectId("pid"),
  setProductQuantity
);

// Remover producto (user)
router.delete(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  requireRole("user"),
  validateObjectId("cid"),
  validateObjectId("pid"),
  removeProductFromCart
);

// Vaciar carrito (user)
router.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  requireRole("user"),
  validateObjectId("cid"),
  clearCart
);

export default router;
