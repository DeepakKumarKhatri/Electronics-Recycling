const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");

const getRewards = async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany();
    res.json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching rewards" });
  }
};

const getUserPoints = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    res.json({ points: user.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user points" });
  }
};

const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const reward = await prisma.reward.findUnique({ where: { id: parseInt(rewardId) } });
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    if (user.points < reward.points) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { points: { decrement: reward.points } },
      }),
      prisma.redemption.create({
        data: {
          userId: user.id,
          rewardId: reward.id,
        },
      }),
    ]);

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    res.json({ message: "Reward redeemed successfully", points: updatedUser.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error redeeming reward" });
  }
};

module.exports = {
  getRewards,
  getUserPoints,
  redeemReward,
};