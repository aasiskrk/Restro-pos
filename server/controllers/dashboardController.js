const Order = require("../models/orderModel");
const { MenuItem } = require("../models/menuModel");
const Staff = require("../models/staffModel");
const Attendance = require("../models/attendanceModel");

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const { timeRange = "today" } = req.query;

    // Get date ranges for sales
    const currentDate = new Date();
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    console.log("Date ranges for dashboard:", {
      today: today.toISOString(),
      tomorrow: tomorrow.toISOString(),
      yesterday: yesterday.toISOString(),
    });

    // Calculate start date based on time range
    let startDate = today;
    let groupByFormat = "%H:00"; // Default hourly format
    let dataPoints = 24; // Default 24 hours

    if (timeRange === "week") {
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);
      groupByFormat = "%Y-%m-%d";
      dataPoints = 7;
    } else if (timeRange === "month") {
      startDate = new Date(today);
      startDate.setDate(1); // Start of current month
      groupByFormat = "%Y-%m-%d";
      dataPoints = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate(); // Days in current month
    }

    console.log("Date ranges:", { startDate, today, tomorrow, timeRange });

    // Get today's sales for stats card
    const todaysSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    // Get yesterday's sales for comparison
    const yesterdaySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: today },
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    // Calculate sales change percentage
    const todayTotal = todaysSales[0]?.total || 0;
    const yesterdayTotal = yesterdaySales[0]?.total || 0;
    const salesChange = yesterdayTotal
      ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
      : 0;

    // Get active orders count
    const activeOrders = await Order.countDocuments({
      status: { $in: ["pending", "in-progress"] },
    });

    // Get pending delivery orders
    const pendingDelivery = await Order.countDocuments({
      status: "in-progress",
    });

    // Get staff stats
    const totalStaff = await Staff.countDocuments();
    console.log("Total staff count:", totalStaff);

    // Get today's date
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    // Debug: Log the query parameters
    console.log("Attendance Query Parameters:", {
      status: "present",
      dateRange: {
        start: todayStart,
        end: todayEnd,
      },
    });

    // First get all attendance records for today to debug
    const allTodayAttendance = await Attendance.find({
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    console.log("All attendance records for today:", allTodayAttendance);

    // Get present staff count for today with a simpler query
    const presentStaff = await Attendance.find({
      status: "present",
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    console.log("Present staff records:", presentStaff);

    // Count present staff
    const presentCount = presentStaff.length;

    // Get absent staff similarly
    const absentStaff = await Attendance.find({
      status: "absent",
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    const absentCount = absentStaff.length;
    const staffWithNoRecord = totalStaff - (presentCount + absentCount);

    console.log("Detailed attendance breakdown:", {
      total: totalStaff,
      presentRecords: {
        count: presentCount,
        records: presentStaff.map((record) => ({
          id: record._id,
          staff: record.staff,
          status: record.status,
          date: record.date,
        })),
      },
      absentRecords: {
        count: absentCount,
        records: absentStaff.map((record) => ({
          id: record._id,
          staff: record.staff,
          status: record.status,
          date: record.date,
        })),
      },
      noRecord: staffWithNoRecord,
    });

    // Get low stock items
    const lowStockItems = await MenuItem.find({
      stock: { $lt: 10 },
    }).select("name stock _id");

    const lowStockCount = await MenuItem.countDocuments({
      stock: { $lt: 10 },
    });

    // Get sales data for the graph based on time range
    const salesByPeriod = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: tomorrow },
          status: "completed",
        },
      },
      {
        $group: {
          _id:
            timeRange === "today"
              ? { $hour: "$createdAt" }
              : {
                  $dateToString: { format: groupByFormat, date: "$createdAt" },
                },
          total: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("Sales by period:", salesByPeriod);

    // Fill in missing periods with zero sales
    let salesData;
    if (timeRange === "today") {
      salesData = Array.from({ length: 24 }, (_, hour) => {
        const hourData = salesByPeriod.find((sale) => sale._id === hour);
        return {
          date: `${hour.toString().padStart(2, "0")}:00`,
          total: hourData ? hourData.total : 0,
        };
      });
    } else {
      const dates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= today) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      salesData = dates.map((date) => {
        const periodData = salesByPeriod.find((sale) => sale._id === date);
        return {
          date,
          total: periodData ? periodData.total : 0,
        };
      });
    }

    // Get popular items (from the selected time range)
    const popularItems = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: tomorrow },
          status: "completed",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          totalOrders: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "menuItemDetails",
        },
      },
      {
        $project: {
          name: { $arrayElemAt: ["$menuItemDetails.name", 0] },
          orders: "$totalOrders",
        },
      },
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("table", "number")
      .populate("items.menuItem", "name price");

    const transformedRecentOrders = recentOrders.map((order) => ({
      _id: order._id,
      table: order.table,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    }));

    const dashboardData = {
      stats: {
        todaysSales: todayTotal,
        salesChange,
        activeOrders,
        pendingDelivery,
        staffPresent: presentCount,
        totalStaff,
        lowStockItems: lowStockCount,
        staffAbsent: absentCount,
        staffNoRecord: staffWithNoRecord,
      },
      popularItems,
      recentOrders: transformedRecentOrders,
      salesOverview: salesData,
      lowStockItems,
    };

    console.log("Final dashboard stats:", dashboardData.stats);

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
