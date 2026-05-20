const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blogs",

        // 🔥 ENABLE MODERATION
        moderation: "aws_rekognition",
      },
      (error, result) => {
        if (error) return reject(error);

        // 🚨 SAFETY CHECK HERE
        if (result?.moderation && result.moderation[0]?.status !== "approved") {
          return reject(new Error("Image not approved"));
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
