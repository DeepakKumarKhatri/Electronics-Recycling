export const checkValidity = async (user) => {
  const currentPath = window.location.pathname;

  // Role-specific paths
  const sameURLUser = "/pages/user-dashboard/";
  const sameURLAdmin = "/pages/admin-dashboard/";
  const adminPaths = [
    sameURLAdmin + "",
    sameURLAdmin + "index.html",
    sameURLAdmin + "users-submission.html",
    sameURLAdmin + "reporting.html",
    sameURLAdmin + "system-users.html",
    sameURLAdmin + "admin-profile-management.html",
  ];
  const userPaths = [
    sameURLUser + "",
    sameURLUser + "index.html",
    sameURLUser + "item-submission.html",
    sameURLUser + "history-tracking.html",
    sameURLUser + "rewards-redemption.html",
    sameURLUser + "dyanmic-search.html",
    sameURLUser + "request-pickup.html",
    sameURLUser + "profile-management.html",
  ];

  // Determine if current path is restricted
  const isAdminPath = adminPaths.some((path) => currentPath.includes(path));
  const isUserPath = userPaths.some((path) => currentPath.includes(path));

  // Redirect if accessing wrong role's page
  if (
    (isAdminPath && user.role !== "ADMIN") ||
    (isUserPath && user.role !== "USER")
  ) {
    console.log("Redirect Condition Met");
    const redirectPath =
      user.role === "ADMIN"
        ? sameURLAdmin + "index.html"
        : sameURLUser + "index.html";

    window.location.href = redirectPath;
  }
};
