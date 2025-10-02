import Ticket from "../models/ticket.model.js";

export default class TicketDAO {
  create(data) { return Ticket.create(data); }
  findById(id) { return Ticket.findById(id).lean(); }
}
