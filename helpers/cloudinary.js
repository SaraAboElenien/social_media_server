import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export { cloudinary };

export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
    return uploadResult; 
  } catch (error) {
    console.error('Cloudinary Upload Error:', error.message);
    throw new Error('Cloudinary Upload Failed');
  }
};


