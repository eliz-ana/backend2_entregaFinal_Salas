import mongoose from 'mongoose';

export function validateObjectId(req, res, next) {
  const { uid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  next();
}
export function validateCreateUserBody(req, res, next) {
  const { first_name, last_name, email, age, password, cart, role } = req.body;

  // requeridos
  if (!first_name || !last_name || !email || typeof age !== "number" || !password) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  // tipos básicos
  if (typeof first_name !== "string" || typeof last_name !== "string") {
    return res.status(400).json({ error: "first_name and last_name must be strings" });
  }

  // formato mínimo de email (muy básico, suficiente para esta etapa)
  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // age positivo
  if (!Number.isFinite(age) || age <= 0) {
    return res.status(400).json({ error: "age must be a positive number" });
  }

  // si vienen opcionales, validar tipo
  if (cart && !mongoose.Types.ObjectId.isValid(cart)) {
    return res.status(400).json({ error: "Invalid cart id" });
  }
  if (role && !["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // normalización leve para downstream (el controller igual re-normaliza email)
  req.body.first_name = first_name.trim();
  req.body.last_name = last_name.trim();

  next();
}

export function validateUpdateUserBody(req, res, next) {
  // permitir parciales; validar solo lo que venga
  const { first_name, last_name, email, age, password, cart, role } = req.body;

  if (first_name !== undefined && typeof first_name !== "string") {
    return res.status(400).json({ error: "first_name must be a string" });
  }
  if (last_name !== undefined && typeof last_name !== "string") {
    return res.status(400).json({ error: "last_name must be a string" });
  }
  if (email !== undefined) {
    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }
  }
  if (age !== undefined) {
    if (!Number.isFinite(age) || age <= 0) {
      return res.status(400).json({ error: "age must be a positive number" });
    }
  }
  if (cart !== undefined && cart !== null) {
    if (!mongoose.Types.ObjectId.isValid(cart)) {
      return res.status(400).json({ error: "Invalid cart id" });
    }
  }
  if (role !== undefined && !["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // trims mínimos si vinieron
  if (typeof first_name === "string") req.body.first_name = first_name.trim();
  if (typeof last_name === "string") req.body.last_name = last_name.trim();

  next();
}