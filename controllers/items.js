const prisma = require("../database/db.config");
const cloudinary = require("../utils/cloudinary");
const { getUser } = require("../service/auth");
const { Readable } = require("stream");

const getItems = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { status, itemType } = req.query;

    const items = await prisma.recycleItem.findMany({
      where: {
        userId: user.id,
        ...(status && { status: status.toUpperCase() }), // Optional filtering
        ...(itemType && { itemType }),
      },
    });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.cookies.uid;

    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const item = await prisma.recycleItem.findFirst({
      where: {
        id: Number(id),
        userId: user.id,
      },
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    return res.status(200).json({ item });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { itemType, description, condition, weight } = req.body;

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

    const points = (condition) => {
      switch (condition) {
        case "New":
          return 100;
        case "Like New":
          return 80;
        case "Good":
          return 60;
        case "Fair":
          return 40;
        case "Poor":
          return 10;
        default:
          return 1;
      }
    };

    const item_data = {
      itemType,
      description,
      condition,
      weight: Number(weight),
      rewards_points: points(condition),
      status: "pending",
      imageUrl: uploadedImage.secure_url || user.imageUrl,
      imageId: uploadedImage.public_id || user.imageId,
    };

    const recycled_item = await prisma.recycleItem.create({
      data: item_data,
    });

    return res.status(200).json({ item: recycled_item, message: "success" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.cookies.uid;

    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const item = await prisma.recycleItem.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.imageId) {
      await cloudinary.uploader.destroy(item.imageId); // Delete associated image
    }

    await prisma.recycleItem.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.cookies.uid;

    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { itemType, description, condition, weight, status } = req.body;

    const existingItem = await prisma.recycleItem.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!existingItem)
      return res.status(404).json({ message: "Item not found" });

    let updatedImage = {};
    if (req.file) {
      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "File size exceeds 2MB" });
      }

      if (existingItem.imageId) {
        await cloudinary.uploader.destroy(existingItem.imageId); // Delete old image
      }

      updatedImage = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", public_id: `${Date.now()}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(uploadStream);
      });
    }

    const updatedItem = await prisma.recycleItem.update({
      where: { id: Number(id) },
      data: {
        itemType,
        description,
        condition,
        weight: weight ? Number(weight) : existingItem.weight,
        status: status ? status.toUpperCase() : existingItem.status,
        imageUrl: updatedImage.secure_url || existingItem.imageUrl,
        imageId: updatedImage.public_id || existingItem.imageId,
      },
    });

    return res
      .status(200)
      .json({ item: updatedItem, message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getItems,
  getItem,
  deleteItem,
  updateItem,
  addItem,
};
