import PasswordResetDAO from "../dao/passwordReset.dao.js";

export default class PasswordResetRepository {
  constructor() {
    this.dao = new PasswordResetDAO();
  }
  create(data) {
    return this.dao.create(data);
  }
  findValidByUser(userId) {
    return this.dao.findValidByUser(userId);
  }
  markUsed(id) {
    return this.dao.markUsed(id);
  }
}
