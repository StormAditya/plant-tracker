const ADMIN_USERNAME = 'RSWF';
const ADMIN_PASSWORD = 'RSWFPASS';
const ADMIN_TOKEN = 'RSWF_ADMIN_AUTH_TOKEN_ACTIVE';

const authController = {
  // Admin Login - Only RSWF / RSWFPASS allowed
  login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      if (trimmedUser === ADMIN_USERNAME && trimmedPass === ADMIN_PASSWORD) {
        console.log(`🔐 Admin login successful for user: ${ADMIN_USERNAME}`);
        return res.json({
          success: true,
          message: 'Logged in successfully as RSWF Admin',
          token: ADMIN_TOKEN,
          user: {
            username: ADMIN_USERNAME,
            role: 'admin',
            displayName: 'RSWF Administrator'
          }
        });
      }

      console.warn(`⚠️ Failed admin login attempt with username: "${trimmedUser}"`);
      return res.status(401).json({
        error: 'Invalid username or password. Only the authorized RSWF admin can log in.'
      });
    } catch (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Login process failed', details: err.message });
    }
  },

  // Verify current token status
  verify(req, res) {
    const authHeader = req.headers.authorization || '';
    const adminHeader = req.headers['x-admin-token'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '') || adminHeader;

    if (token === ADMIN_TOKEN) {
      return res.json({
        success: true,
        isAdmin: true,
        user: { username: ADMIN_USERNAME, role: 'admin' }
      });
    }

    return res.status(401).json({
      success: false,
      isAdmin: false,
      error: 'Not authenticated as admin'
    });
  }
};

module.exports = authController;
