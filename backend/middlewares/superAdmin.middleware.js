
export const superAdminMiddleware = (req, res, next) => {
    try {
        // Check if user exists (authentication check)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        const role = req.user.role;

        // Check if role exists
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "User role is missing."
            });
        }

        // Authorization check
        if (role !== "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super admin privileges required."
            });
        }

        // If everything is fine
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error."
        });
    }
};