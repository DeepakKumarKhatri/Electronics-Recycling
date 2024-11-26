const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");

const getAllRequests = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const requests = await prisma.pickupRequest.findMany({
      where: {
        userId: user.id,
      },
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const raiseRequest = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const {
      pickupAddress,
      pickupDate,
      pickupTime,
      itemsForPickup,
      specialInstructions,
    } = req.body;

    const final_data = {
      pickupAddress,
      pickupDate,
      pickupTime,
      itemsForPickup,
      specialInstructions,
      status: "PENDING",
      userId: Number(user.id),
    };

    const new_request = await prisma.pickupRequest.create({
      data: final_data,
    });

    return res.status(200).json({ item: new_request, message: "success" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = req.cookies.uid;

    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const pickup_request = await prisma.recycleItem.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!pickup_request)
      return res.status(404).json({ message: "Item not found" });

    await prisma.pickupRequest.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllRequests,
  raiseRequest,
  cancelRequest,
};
