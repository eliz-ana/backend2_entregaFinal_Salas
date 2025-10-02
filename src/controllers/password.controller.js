import { requestPasswordReset, performPasswordReset} from "../services/passwordReset.service.js";

// POST /api/sessions/forgot  { email }
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "email is required" });

    await requestPasswordReset(email);
    // No revelamos si existe o no
    return res.json({ message: "If an account exists, a reset email has been sent." });
  } catch (e) { next(e); }
};
export async function resetPassword(req, res, next) {
  try {
    const { email, token, newPassword } = req.body || {};
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: "email, token and newPassword are required" });
    }
    await performPasswordReset(email, token, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (e) { next(e); }
}