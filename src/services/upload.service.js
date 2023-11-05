const cloudinary = require('./../configs/cloudinary.config')

const uploadImageFromUrl = async () => {
  try {
    const urlImage = ''
    const folderName = 'product/shopDEV'
    const newFileName = 'testdemo'

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName
    })
    console.log(result);
    return result
  } catch (error) {
    console.error('Error uploading image::', error)
  }
}

const uploadImageFromLocal = async ({
  path,
  folderName = 'product/shopDEV'
}) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    })
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.error('Error uploading image::', error);
  }
}

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal
}