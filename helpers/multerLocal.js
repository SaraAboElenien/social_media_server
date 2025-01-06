
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); 
//   },
// });

// const multerFileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type'), false);
//   }
// };

// export const uploadImage = (fieldName) => {
//   return multer({
//     storage: multerStorage,
//     fileFilter: multerFileFilter,
//   }).single(fieldName);  
// };


import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from 'nanoid';
import path from "path";


const multerFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const uploadImage = (fieldName) => {
  return multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }).single(fieldName);
};

export const handleCloudinaryUpload = async (req, res, next) => {
  console.log('req.file:', req.file); 
  if (!req.file) {
    return next(new Error('Image field is required!'));
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const folderName = req.file.fieldname === 'profileImage' 
    ? 'SocialMedia/Users/ProfileImages'
    : req.file.fieldname === 'postImage'
    ? 'SocialMedia/Posts'
    : 'SocialMedia/Other';

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: folderName
      });
    console.log('Cloudinary Upload Result:', uploadResult);


    req.uploadedImage = {
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };

    next();
  } catch (error) {
    next(new Error(`Upload failed: ${error.message}`));
  }
};
