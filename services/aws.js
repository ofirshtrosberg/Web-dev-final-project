
const aws = require('aws-sdk');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  })

async function uploadImgToS3(fileName, blob) {
    const params = {
        Bucket: process.env.PROFILE_PIC_BUCKET_NAME,
        Key: fileName,
        Body: blob
    };
    const uploadedImage = await s3.upload(params).promise();
    return uploadedImage.Location;
}

module.exports = { uploadImgToS3 }