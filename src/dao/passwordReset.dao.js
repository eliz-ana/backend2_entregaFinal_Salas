import PasswordReset from "../models/passwordReset.model.js";

export default class PasswordResetDAO {
  create(data) {
    return PasswordReset.create(data);
  }
  // último reset válido para un usuario
  findValidByUser(userId) {
    return PasswordReset.findOne({
      userId,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();
  }
  markUsed(id) {
    return PasswordReset.findByIdAndUpdate(id, { usedAt: new Date() }, { new: true }).lean();
  }
}
