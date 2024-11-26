const prisma = require("../database/db.config");
const { getUser } = require("../service/auth");

const getDashboardData = async (req, res) => {
  try {

    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    // Get total users count
    const totalUsers = await prisma.user.count({
      where: { role: 'USER' }
    });

    // Calculate total recycled weight
    const totalRecycled = await prisma.recycleItem.aggregate({
      where: { status: 'APPROVED' },
      _sum: { weight: true }
    });

    // Get pending pickup requests
    const pendingPickups = await prisma.pickupRequest.count({
      where: { status: 'PENDING' }
    });

    // Monthly Recycling Trends (last 6 months)
    const recyclingTrends = await prisma.recycleItem.groupBy({
      by: ['createdAt'],
      where: {
        status: 'APPROVED',
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      _sum: { weight: true },
      orderBy: { createdAt: 'asc' }
    });

    // User Growth Trends
    const userGrowthTrends = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        role: 'USER',
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    });

    // Recent Activity
    const recentActivity = await prisma.recycleItem.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        createdAt: true,
        itemType: true,
        weight: true,
        user: {
          select: {
            fullName: true
          }
        }
      }
    });

    // Recycling Breakdown by Item Type
    const recyclingBreakdown = await prisma.recycleItem.groupBy({
      by: ['itemType'],
      where: { status: 'APPROVED' },
      _sum: { weight: true }
    });

    res.status(200).json({
      totalUsers,
      totalRecycled: totalRecycled._sum.weight || 0,
      pendingPickups,
      recyclingTrends,
      userGrowthTrends,
      recentActivity: recentActivity.map(activity => ({
        date: activity.createdAt,
        description: `${activity.user.fullName} recycled ${activity.weight}kg of ${activity.itemType}`
      })),
      recyclingBreakdown
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {

    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { page = 1, limit = 10, search = '' } = req.query;
    
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } }
        ]
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
            pickupRequest: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: Number(limit)
    });

    const total = await prisma.user.count({
      where: {
        role: 'USER',
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } }
        ]
      }
    });

    res.status(200).json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

const getUsersSubmissions = async (req, res) => {
  try {

    const sessionId = req.cookies.uid;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUser(sessionId);
    if (!user) return res.status(401).json({ message: "Session expired" });

    const { page = 1, limit = 10, status, search = '' } = req.query;
    
    const whereCondition = {
      ...(status && { status }),
      OR: [
        { itemType: { contains: search } },
        { user: { fullName: { contains: search } } }
      ]
    };

    const submissions = await prisma.recycleItem.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.recycleItem.count({ where: whereCondition });

    res.status(200).json({
      submissions,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalSubmissions: total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user submissions", error: error.message });
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
        updatedAt: new Date()
      }
    });

    res.status(200).json({ 
      message: "Submission status updated successfully", 
      submission: updatedSubmission 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating submission status", error: error.message });
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
        updatedAt: new Date()
      }
    });

    res.status(200).json({ 
      message: "Pickup request status updated successfully", 
      pickup: updatedPickup 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating pickup request status", error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getAllUsers,
  getUsersSubmissions,
  changeStatusOfSubmission,
  changeStatusOfPickUpRequest
};