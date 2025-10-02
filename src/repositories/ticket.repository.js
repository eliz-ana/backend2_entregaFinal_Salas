import TicketDAO from "../dao/ticket.dao.js";

export default class TicketRepository {
  constructor(){ this.dao = new TicketDAO(); }
  createTicket(data){ return this.dao.create(data); }
  findById(id){ return this.dao.findById(id); }
}
