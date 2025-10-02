import CartDAO from "../dao/cart.dao.js";

export default class CartRepository {
  constructor() {
    this.dao = new CartDAO();
  }

  createEmpty(owner = null) {
    return this.dao.createEmpty(owner);
  }

  findById(id, opts = {}) {
    return this.dao.getById(id, opts); // { populated: true|false }
  }

  addProduct(cartId, productId, quantity = 1) {
    return this.dao.addProduct(cartId, productId, quantity);
  }

  updateQuantity(cartId, productId, quantity) {
    return this.dao.updateQuantity(cartId, productId, quantity);
  }

  removeProduct(cartId, productId) {
    return this.dao.removeProduct(cartId, productId);
  }

  clear(cartId) {
    return this.dao.clear(cartId);
  }
}
