// src/repositories/user.repository.js
import UserDAO from "../dao/user.dao.js";

export default class UserRepository {
  constructor() {
    this.dao = new UserDAO();
  }

  // Lecturas
  async findById(id) {
    return this.dao.getById(id); 
  }
  async findByEmail(email) {
    return this.dao.getByEmail(email); 
  }
  async list(params = {}) {
    
    return this.dao.getAll(params);
  }

  // Mutaciones
  async createUser(data) {
    return this.dao.create(data);
  }
  async updateUser(id, data) {
    return this.dao.update(id, data);
  }
  async deleteUser(id) {
    return this.dao.delete(id);
  }
}
