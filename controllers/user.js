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

      // Upload file buffer to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", public_id: `${Date.now()}` },
        (error, result) => {
          if (error) throw error;
          uploadedImage = result;
        }
      );

      // Convert buffer to readable stream
      const readableStream = Readable.from(req.file.buffer);
      readableStream.pipe(uploadStream);
    }

    console.log({ uploadedImage });

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
    return res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { getUserDetails, updateProfileData };
