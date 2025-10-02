import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import crypto from "crypto";

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();
const ticketRepo = new TicketRepository();

function genCode(){ return crypto.randomUUID?.() ?? `T-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

/**
 * Procesa compra:
 * - Descuenta stock solo donde alcanza.
 * - Crea ticket con total de lo comprado.
 * - Deja en el cart los no procesados.
 * Devuelve: { ticket, unprocessedProducts: [pid...] }
 */
export async function processPurchase({ cartId, purchaserEmail }) {
  // 1) Cargar carrito con productos populados
  const cart = await cartRepo.findById(cartId, { populated: true });
  if (!cart) throw Object.assign(new Error("Cart not found"), { status: 404 });

  const boughtItems = [];          // { productId, price, quantity }
  const unprocessed = [];          // productIds que no tenían stock

  // 2) Verificar stock por ítem
  for (const item of cart.products) {
    const p = item.product; // poblado
    if (!p || typeof p.stock !== "number") { unprocessed.push(String(item.product?._id || "")); continue; }

    if (p.stock >= item.quantity) {
      // Descontar stock
      await productRepo.updateProduct(p._id, { stock: p.stock - item.quantity });
      boughtItems.push({ productId: String(p._id), price: p.price, quantity: item.quantity });
    } else {
      unprocessed.push(String(p._id));
    }
  }

  // 3) Calcular monto y crear ticket (si hubo algo comprado)
  let ticket = null;
  if (boughtItems.length > 0) {
    const amount = boughtItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    ticket = await ticketRepo.createTicket({
      code: genCode(),
      amount,
      purchaser: purchaserEmail,
    });
  }

  // 4) Dejar en el carrito solo los no procesados
  if (unprocessed.length === 0) {
    await cartRepo.clear(cartId);
  } else {
    // filtrar los items del cart para dejar solo los no comprados
    const remaining = cart.products
      .filter(it => unprocessed.includes(String(it.product?._id)));
    // setear remaining
    await cartRepo.clear(cartId);
    for (const it of remaining) {
      await cartRepo.addProduct(cartId, it.product._id, it.quantity);
    }
  }

  return { ticket, unprocessedProducts: unprocessed };
}
