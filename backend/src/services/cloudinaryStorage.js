const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables
function initCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

/**
 * Uploads 480p compressed image buffer directly to Cloudinary Free CDN Storage
 */
async function uploadToCloudinary(imageBuffer, filename) {
  initCloudinary();

  const cleanBase = (filename || 'plant')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniquePublicId = `${cleanBase}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'flora_scan_plants',
        public_id: uniquePublicId,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto:good'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          format: result.format
        });
      }
    );

    uploadStream.end(imageBuffer);
  });
}

module.exports = {
  uploadToCloudinary
};
