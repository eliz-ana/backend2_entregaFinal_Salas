import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import { processPurchase } from "../services/purchase.service.js";

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

// POST /api/carts  → crea carrito vacío para el user actual
export async function createCart(req, res, next) {
  try {
    const owner = req.user?.uid ?? null; 
    const cart = await cartRepo.createEmpty(owner);
    res.status(201).json(cart);
  } catch (e) { next(e); }
}

// GET /api/carts/:cid?populated=true
export async function getCart(req, res, next) {
  try {
    const populated = String(req.query.populated || "").toLowerCase() === "true";
    const cart = await cartRepo.findById(req.params.cid, { populated });
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (e) { next(e); }
}

// POST /api/carts/:cid/product/:pid  (body { quantity?: number })
export async function addProductToCart(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const quantity = Number(req.body?.quantity ?? 1);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive number" });
    }

    // (Opcional recomendado) asegurar que el producto exista
    const product = await productRepo.findById(pid);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // (Opcional) si usás owner en cart, podés validar propiedad aquí
    const updated = await cartRepo.addProduct(cid, pid, quantity);
    if (!updated) return res.status(404).json({ error: "Cart not found" });
    res.json(updated);
  } catch (e) { next(e); }
}

// PUT /api/carts/:cid/product/:pid  (body { quantity: number })
export async function setProductQuantity(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const quantity = Number(req.body?.quantity);
    if (!Number.isFinite(quantity)) {
      return res.status(400).json({ error: "quantity must be a number" });
    }

    // (Opcional) validar existencia del producto
    const product = await productRepo.findById(pid);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const updated = await cartRepo.updateQuantity(cid, pid, quantity);
    if (!updated) return res.status(404).json({ error: "Cart not found" });
    res.json(updated);
  } catch (e) { next(e); }
}

// DELETE /api/carts/:cid/product/:pid
export async function removeProductFromCart(req, res, next) {
  try {
    const { cid, pid } = req.params;
    const updated = await cartRepo.removeProduct(cid, pid);
    if (!updated) return res.status(404).json({ error: "Cart not found" });
    res.json(updated);
  } catch (e) { next(e); }
}

// DELETE /api/carts/:cid
export async function clearCart(req, res, next) {
  try {
    const updated = await cartRepo.clear(req.params.cid);
    if (!updated) return res.status(404).json({ error: "Cart not found" });
    res.json(updated);
  } catch (e) { next(e); }
}

/// 
// POST /api/carts/:cid/purchase
export async function purchaseCart(req, res, next) {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user?.email;
    if (!purchaserEmail) return res.status(401).json({ error: "Unauthorized" });

    const result = await processPurchase({ cartId: cid, purchaserEmail });
    // ticket puede ser null si no había stock de nada
    return res.status(200).json(result);
  } catch (e) { next(e); }
}