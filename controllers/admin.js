const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");
const cloudinary = require("../utils/cloudinary");
const { Readable } = require("stream");
const bcrypt = require("bcrypt");

const getDashboardData = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    // Get total users count
    const totalUsers = await prisma.user.count({
      where: { role: "USER" },
    });

    // Calculate total recycled weight
    const totalRecycled = await prisma.recycleItem.aggregate({
      where: { status: "APPROVED" },
      _sum: { weight: true },
    });

    // Get pending pickup requests
    const pendingPickups = await prisma.pickupRequest.count({
      where: { status: "PENDING" },
    });

    // Monthly Recycling Trends (last 6 months)
    const recyclingTrends = await prisma.recycleItem.groupBy({
      by: ["createdAt"],
      where: {
        status: "APPROVED",
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
      _sum: { weight: true },
      orderBy: { createdAt: "asc" },
    });

    // User Growth Trends
    const userGrowthTrends = await prisma.user.groupBy({
      by: ["createdAt"],
      where: {
        role: "USER",
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    // Recent Activity
    const recentActivity = await prisma.recycleItem.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        itemType: true,
        weight: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    // Recycling Breakdown by Item Type
    const recyclingBreakdown = await prisma.recycleItem.groupBy({
      by: ["itemType"],
      where: { status: "APPROVED" },
      _sum: { weight: true },
    });

    res.status(200).json({
      totalUsers,
      totalRecycled: totalRecycled._sum.weight || 0,
      pendingPickups,
      recyclingTrends,
      userGrowthTrends,
      recentActivity: recentActivity.map((activity) => ({
        date: activity.createdAt,
        description: `${activity.user.fullName} recycled ${activity.weight}kg of ${activity.itemType}`,
      })),
      recyclingBreakdown,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { page = 1, limit = 10, search = "" } = req.query;

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone_number: true,
        createdAt: true,
        points: true,
        _count: {
          select: {
            recycleItem: true,
            pickupRequest: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    const total = await prisma.user.count({
      where: {
        role: "USER",
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
        ],
      },
    });

    res.status(200).json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUsersSubmissions = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { page = 1, limit = 10, status, search = "" } = req.query;

    const whereCondition = {
      ...(status && { status }),
      OR: [
        { itemType: { contains: search } },
        { user: { fullName: { contains: search } } },
      ],
    };

    const submissions = await prisma.recycleItem.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.recycleItem.count({ where: whereCondition });

    res.status(200).json({
      submissions,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalSubmissions: total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching user submissions",
      error: error.message,
    });
  }
};

const changeStatusOfSubmission = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { submissionId, status } = req.body;

    const updatedSubmission = await prisma.recycleItem.update({
      where: { id: submissionId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Submission status updated successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating submission status",
      error: error.message,
    });
  }
};

const changeStatusOfPickUpRequest = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { pickupId, status } = req.body;

    const updatedPickup = await prisma.pickupRequest.update({
      where: { id: pickupId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Pickup request status updated successfully",
      pickup: updatedPickup,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating pickup request status",
      error: error.message,
    });
  }
};

const getAdminDetails = async (req, res) => {
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

    const { fullName, email, password } = req.body;
    const updateData = {
      fullName,
      email,
    };

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

          // Add image details to update data
          updateData.imageUrl = uploadedImage.secure_url || user.imageUrl;
          updateData.imageId = uploadedImage.public_id || user.imageId;
        });
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    // Only update password if it's provided in the request
    if (password) {
      // Validate password complexity if needed
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Remove sensitive data before sending response
    delete updatedUser.password;

    return res
      .status(200)
      .json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    let user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { userId } = req.params;
    user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone_number: true,
        createdAt: true,
        points: true,
        imageUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user details" });
  }
};

const getRecyclingOverview = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    // Total recycled items
    const totalRecycleItems = await prisma.recycleItem.count();
    const approvedRecycleItems = await prisma.recycleItem.count({
      where: { status: "APPROVED" },
    });

    // Total weight of recycled items
    const totalWeight = await prisma.recycleItem.aggregate({
      _sum: { weight: true },
    });

    // Recycling items by type
    const recycleItemsByType = await prisma.recycleItem.groupBy({
      by: ["itemType"],
      _count: { id: true },
      _sum: { weight: true },
    });

    // Monthly recycling trends
    const monthlyRecyclingTrends = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month, 
        COUNT(*) as itemCount,
        SUM(weight) as totalWeight
      FROM RecycleItem
      WHERE status = 'APPROVED'
      GROUP BY month
      ORDER BY month
      LIMIT 12
    `;

    // Pickup request statistics
    const pickupRequestStats = await prisma.pickupRequest.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    res.status(200).json({
      totalRecycleItems,
      approvedRecycleItems,
      totalWeight: totalWeight._sum.weight || 0,
      recycleItemsByType,
      monthlyRecyclingTrends,
      pickupRequestStats,
    });
  } catch (error) {
    console.error("Error generating recycling overview:", error);
    res.status(500).json({
      message: "Failed to generate recycling overview",
      error: error.message,
    });
  }
};

const getUserRecyclingPerformance = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { page = 1, limit = 10, sortBy = "totalWeight" } = req.query;

    // First, fetch the users with their recycling items
    const userPerformance = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        fullName: true,
        email: true,
        points: true,
        recycleItem: {
          where: { status: "APPROVED" },
          select: {
            weight: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    // Transform user performance data with total weight calculation
    const processedPerformance = userPerformance.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      points: user.points,
      totalItems: user.recycleItem.length,
      totalWeight: user.recycleItem.reduce((sum, item) => sum + item.weight, 0),
    }));

    // Sort the processed performance
    const sortedPerformance = processedPerformance.sort((a, b) =>
      sortBy === "totalWeight"
        ? b.totalWeight - a.totalWeight
        : b.totalItems - a.totalItems
    );

    const totalUsers = await prisma.user.count({
      where: { role: "USER" },
    });

    res.status(200).json({
      userPerformance: sortedPerformance,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching user recycling performance:", error);
    res.status(500).json({
      message: "Failed to fetch user recycling performance",
      error: error.message,
    });
  }
};

const getEnvironmentalImpactReport = async (req, res) => {
  try {
    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    // CO2 savings calculation (estimated)
    const totalWeight = await prisma.recycleItem.aggregate({
      _sum: { weight: true },
      where: { status: "APPROVED" },
    });

    // Estimations based on average recycling impact
    const CO2_SAVINGS_PER_KG = 2.5; // Estimated kg of CO2 saved per kg recycled
    const ENERGY_SAVINGS_PER_KG = 0.5; // Estimated kWh saved per kg recycled
    const WATER_SAVINGS_PER_KG = 0.3; // Estimated liters of water saved per kg recycled

    const weight = totalWeight._sum.weight || 0;

    const environmentalImpact = {
      totalWeight: weight,
      CO2Savings: weight * CO2_SAVINGS_PER_KG,
      energySavings: weight * ENERGY_SAVINGS_PER_KG,
      waterSavings: weight * WATER_SAVINGS_PER_KG,
    };

    // Breakdown by item type
    const itemTypeBreakdown = await prisma.recycleItem.groupBy({
      by: ["itemType"],
      _sum: { weight: true },
      where: { status: "APPROVED" },
    });

    res.status(200).json({
      environmentalImpact,
      itemTypeBreakdown,
    });
  } catch (error) {
    console.error("Error generating environmental impact report:", error);
    res.status(500).json({
      message: "Failed to generate environmental impact report",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
  getAllUsers,
  getUsersSubmissions,
  changeStatusOfSubmission,
  changeStatusOfPickUpRequest,
  getAdminDetails,
  updateProfileData,
  getUserDetails,
  getRecyclingOverview,
  getUserRecyclingPerformance,
  getEnvironmentalImpactReport,
};
