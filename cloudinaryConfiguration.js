const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

cloudinary.config({  
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
  });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
      folder: 'SKILLHUB',
      allowedFormats:["png","jpg","jpeg","pdf"]
    },
});

module.exports = storage;