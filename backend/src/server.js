const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend website and future mobile app requests
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve compressed plant images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Plant Identifier & Height Tracker REST API',
    compressionTarget: '480p Max Resolution',
    mobileAppReady: true,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Plant Tracker Backend REST API running on port ${PORT}`);
  console.log(` Mobile App & Web App Base URL: http://localhost:${PORT}/api`);
  console.log(` Uploads Folder: http://localhost:${PORT}/uploads/`);
  console.log(`====================================================`);
});
