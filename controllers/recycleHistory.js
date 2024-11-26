const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");

const getRecycleHistory = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { dateRange, itemType } = req.query;

    let dateFilter = {};
    if (dateRange && dateRange !== 'all') {
      const daysAgo = parseInt(dateRange);
      dateFilter = {
        createdAt: {
          gte: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        }
      };
    }

    let typeFilter = {};
    if (itemType && itemType !== 'all') {
      typeFilter = { itemType };
    }

    const recycleItems = await prisma.recycleItem.findMany({
      where: {
        userId: user.id,
        ...dateFilter,
        ...typeFilter
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalItems = recycleItems.length;
    const totalWeight = recycleItems.reduce((sum, item) => sum + item.weight, 0);
    const co2Saved = totalWeight * 2.5; // 2.5 kg CO2 saved per kg recycled

    return res.status(200).json({
      items: recycleItems,
      summary: {
        totalItems,
        totalWeight,
        co2Saved
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getRecycleHistory
};