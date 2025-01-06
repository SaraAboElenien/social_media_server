// import { v2 as cloudinary } from 'cloudinary';
// import { nanoid } from 'nanoid';



// export const uploadImageToCloudinary = async (req, res, next) => {
//   console.log('req.file:', req.file); 
//   if (!req.file) {
//     return next(new Error('Image field is required!'));
//   }

//   const folderName = req.file.fieldname === 'profileImage' 
//     ? 'SocialMedia/Users/ProfileImages'
//     : req.file.fieldname === 'postImage'
//     ? 'SocialMedia/Posts'
//     : 'SocialMedia/Other';

//   try {  
//     const customId = nanoid(5);
//     const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//       folder: `${folderName}/${customId}`,
//     });

//     console.log('Cloudinary Upload Result:', uploadResult);

//     req.uploadedImage = {
//       secure_url: uploadResult.secure_url,
//       public_id: uploadResult.public_id,
//     };

//     next();
//   } catch (error) {
//     console.error('Cloudinary Upload Error:', error.message);
//     return next(new Error(`Cloudinary Upload Error: ${error.message}`));
//   }
// };

  
  