const ADMIN_TOKEN = 'RSWF_ADMIN_AUTH_TOKEN_ACTIVE';

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const adminHeader = req.headers['x-admin-token'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || adminHeader;

  if (token === ADMIN_TOKEN) {
    return next();
  }

  console.warn(`⛔ Unauthorized request blocked: ${req.method} ${req.originalUrl}`);
  return res.status(401).json({
    error: 'Unauthorized: RSWF Admin access required to add, edit, or delete plant records.'
  });
}

module.exports = {
  requireAdmin
};
