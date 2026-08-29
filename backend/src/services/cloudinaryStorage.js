const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

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
 * Extract Cloudinary public_id from a secure URL
 * e.g. https://res.cloudinary.com/lfrakie3/image/upload/v1724927182/flora_scan_plants/img_480p_1724927182.webp
 * returns: flora_scan_plants/img_480p_1724927182
 */
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1];
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch (err) {
    console.error('Error parsing Cloudinary URL:', err);
    return null;
  }
}

/**
 * Uploads 480p compressed image buffer directly to Cloudinary Free CDN Storage
 */
async function uploadToCloudinary(imageBuffer, filename) {
  initCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'flora_scan_plants',
        public_id: filename.replace(/\.[^/.]+$/, ''),
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

/**
 * Deletes an image from Cloudinary Free CDN or local storage when a plant is deleted
 */
async function deleteImageFileOrCloud(imageUrl) {
  if (!imageUrl) return;

  // Case 1: Cloudinary CDN deletion
  if (imageUrl.includes('cloudinary.com')) {
    initCloudinary();
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (publicId) {
      try {
        console.log(`☁️ Deleting photo from Cloudinary Free CDN (public_id: ${publicId})...`);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Cloudinary deletion success:`, result);
        return result;
      } catch (err) {
        console.error('⚠️ Failed to delete photo from Cloudinary CDN:', err.message);
      }
    }
  }

  // Case 2: Local Uploads folder deletion
  if (imageUrl.startsWith('/uploads/') || imageUrl.includes('/uploads/')) {
    try {
      const filename = path.basename(imageUrl);
      const localFilePath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log(`🗑️ Deleted local image file: ${localFilePath}`);
      }
    } catch (localErr) {
      console.error('⚠️ Failed to delete local image file:', localErr.message);
    }
  }
}

module.exports = {
  uploadToCloudinary,
  deleteImageFileOrCloud
};
