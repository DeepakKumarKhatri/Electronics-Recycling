const prisma = require("../database/db.config");
const cloudinary = require("../utils/cloudinary");
const { getUser } = require("../service/auth");
const { Readable } = require("stream");

const getUserDetails = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateProfileData = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { fullName, email, phone_number, address } = req.body;

    let uploadedImage = {};
    if (req.file) {
      // Validate file size
      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "File size exceeds 2MB" });
      }

      try {
        // Upload file buffer to Cloudinary
        uploadedImage = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", public_id: `${Date.now()}` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          // Convert buffer to readable stream
          const readableStream = Readable.from(req.file.buffer);
          readableStream.pipe(uploadStream);
        });
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName,
        email,
        phone_number,
        address,
        imageUrl: uploadedImage.secure_url || user.imageUrl,
        imageId: uploadedImage.public_id || user.imageId,
      },
    });

    return res
      .status(200)
      .json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getUserDetails, updateProfileData };
