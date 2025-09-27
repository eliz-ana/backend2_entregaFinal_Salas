import Product from "../models/product.model.js";
export default class ProductDAO {
  async getAll() { return Product.find().lean(); }
  async getById(id) { return Product.findById(id).lean(); }
  async getByCode(code) { return Product.findOne({ code }).lean(); }
  async create(data) { return Product.create(data); }
  async update(id, data) { return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(); }
  async delete(id) { return Product.findByIdAndDelete(id).lean(); }
}
