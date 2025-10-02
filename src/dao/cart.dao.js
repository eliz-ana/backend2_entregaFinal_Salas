import mongoose from "mongoose";
import Cart from "../models/cart.model.js";

export default class CartDAO {
  /**
   * Crea un carrito vacío (opcionalmente asociado a un owner)
   */
  async createEmpty(owner = null) {
    return Cart.create({ owner, products: [] });
  }

  /**
   * Trae un carrito por id. Si populated=true, popula los productos.
   */
  async getById(id, { populated = false } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const query = Cart.findById(id);
    if (populated) query.populate("products.product");
    return query.lean();
  }

  /**
   * Agrega un producto (o incrementa su cantidad si ya existe)
   */
  async addProduct(cartId, productId, quantity = 1) {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) return null;

    // Intentar incrementar si ya existe
    const updated = await Cart.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    ).lean();

    if (updated) return updated;

    // Si no existía, hacer push del item nuevo
    return Cart.findByIdAndUpdate(
      cartId,
      { $push: { products: { product: productId, quantity } } },
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * Setea una cantidad exacta para un producto del carrito.
   * Si quantity <= 0, elimina el item.
   */
  async updateQuantity(cartId, productId, quantity) {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) return null;

    if (quantity <= 0) {
      return Cart.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      ).lean();
    }

    // Si existe, setear cantidad
    const updated = await Cart.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true, runValidators: true }
    ).lean();

    if (updated) return updated;

    // Si no existía, crear el item con esa cantidad
    return Cart.findByIdAndUpdate(
      cartId,
      { $push: { products: { product: productId, quantity } } },
      { new: true, runValidators: true }
    ).lean();
  }



  async removeProduct(cartId, productId) {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) return null;

    return Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    ).lean();
  }

 
  async clear(cartId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) return null;

    return Cart.findByIdAndUpdate(
      cartId,
      { $set: { products: [] } },
      { new: true }
    ).lean();
  }
}
