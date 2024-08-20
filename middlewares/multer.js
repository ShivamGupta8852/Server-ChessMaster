import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utilies/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_images',
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

export default upload;
