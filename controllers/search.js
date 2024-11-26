const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");

const searchRecycleItems = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { searchTerm, category, dateRange } = req.query;

    let dateFilter = {};
    if (dateRange && dateRange !== "all") {
      const daysAgo = parseInt(dateRange);
      dateFilter = {
        createdAt: {
          gte: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      };
    }

    const items = await prisma.recycleItem.findMany({
      where: {
        userId: user.id,
        OR: [
          { itemType: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
        ...(category !== "all" ? { itemType: category } : {}),
        ...dateFilter,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching recycle items" });
  }
};

module.exports = {
  searchRecycleItems,
};
