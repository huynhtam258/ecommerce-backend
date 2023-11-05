const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'darzhlzpy',
  api_key: '334258369538565',
  api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = cloudinary