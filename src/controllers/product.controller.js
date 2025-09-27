import ProductRepository from "../repositories/product.repository.js";
const productRepo = new ProductRepository();

export async function getProducts(req, res, next) {
  try { res.json(await productRepo.list()); } catch (e) { next(e); }
}
export async function getProductById(req, res, next) {
  try {
    const p = await productRepo.findById(req.params.pid);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (e) { next(e); }
}
export async function createProduct(req, res, next) {
  try { res.status(201).json(await productRepo.createProduct(req.body)); } catch (e) { next(e); }
}
export async function updateProduct(req, res, next) {
  try {
    const p = await productRepo.updateProduct(req.params.pid, req.body);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (e) { next(e); }
}
export async function deleteProduct(req, res, next) {
  try {
    const p = await productRepo.deleteProduct(req.params.pid);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (e) { next(e); }
}
