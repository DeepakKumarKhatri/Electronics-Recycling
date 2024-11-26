const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");

const getDashboardData = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const recycleItems = await prisma.recycleItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const totalRecycled = recycleItems.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    const co2Saved = totalRecycled * 2.5; // 2.5 kg CO2 saved per kg recycled

    const nextPickup = await prisma.pickupRequest.findFirst({
      where: { userId: user.id, status: "PENDING" },
      orderBy: { pickupDate: "asc" },
    });

    const recentActivity = await prisma.recycleItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const recyclingHistory = await prisma.recycleItem.groupBy({
      by: ["createdAt"],
      _sum: {
        weight: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 6,
    });

    const recyclingBreakdown = await prisma.recycleItem.groupBy({
      by: ["itemType"],
      _sum: {
        weight: true,
      },
    });

    res.json({
      totalRecycled,
      rewardPoints: user.points,
      co2Saved,
      nextPickup: nextPickup ? nextPickup.pickupDate : null,
      recentActivity,
      recyclingHistory,
      recyclingBreakdown,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};

module.exports = {
  getDashboardData,
};
