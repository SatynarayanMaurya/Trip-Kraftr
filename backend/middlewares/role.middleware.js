

export const roleMiddleware = (allowed = []) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: User role not found"
                });
            }

            if (!allowed.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have permission to access this resource"
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error?.message || "Internal server error"
            });
        }
    };
};