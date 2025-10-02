import crypto from "crypto";
import bcrypt from "bcrypt";
import PasswordResetRepository from "../repositories/passwordReset.repository.js";
import UserRepository from "../repositories/user.repository.js";
import { sendPasswordResetEmail } from "./mail.service.js";

const userRepo = new UserRepository();
const resetRepo = new PasswordResetRepository();

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

/**
 * Genera un token de 1h, lo guarda hasheado y envía el mail con el link.
 * Siempre resuelve sin revelar si el email existe o no (seguridad).
 */
export async function requestPasswordReset(email) {
  const norm = (email || "").toLowerCase().trim();
  const user = await userRepo.findByEmail(norm);

  // Respondemos igual aunque no exista (no filtrar cuentas)
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await resetRepo.create({ userId: user._id, tokenHash, expiresAt });

  const url = `${process.env.APP_BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(norm)}`;
  await sendPasswordResetEmail(norm, url);
};


export async function performPasswordReset(email, token, newPassword) {
  const norm = (email || "").toLowerCase().trim();
  const user = await userRepo.findByEmail(norm);
  if (!user) throw Object.assign(new Error("Invalid token"), { status: 401 });

  const rec = await resetRepo.findValidByUser(user._id);
  if (!rec || sha256(token) !== rec.tokenHash) {
    throw Object.assign(new Error("Token expired or invalid"), { status: 401 });
  }

  // no permitir misma contraseña
  const same = await bcrypt.compare(newPassword || "", user.password);
  if (same) {
    throw Object.assign(new Error("New password must be different"), { status: 400 });
  }

  // actualizar pass e invalidar el token
  const hashed = await bcrypt.hash(newPassword, 10);
  await userRepo.updateUser(user._id, { password: hashed });
  await resetRepo.markUsed(rec._id);
  return { ok: true };
}
