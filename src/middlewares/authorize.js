// src/middlewares/authorize.js
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ error: "Unauthorized" });
    if (!allowedRoles.includes(role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

// Opcional (cuando tengas carts con owner)
export function requireOwner(getOwnerId) {
  // getOwnerId: (req) => string (e.g., owner del cart)
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);
      if (!ownerId) return res.status(404).json({ error: "Resource not found" });
      if (String(ownerId) !== String(req.user?.uid)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch (err) { next(err); }
  };
}
