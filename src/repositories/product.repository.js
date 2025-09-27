import ProductDAO from "../dao/product.dao.js";

export default class ProductRepository {
  constructor() { this.dao = new ProductDAO(); }
  list() { return this.dao.getAll(); }
  findById(id) { return this.dao.getById(id); }
  findByCode(code) { return this.dao.getByCode(code); }
  createProduct(data) { return this.dao.create(data); }
  updateProduct(id, data) { return this.dao.update(id, data); }
  deleteProduct(id) { return this.dao.delete(id); }
}
