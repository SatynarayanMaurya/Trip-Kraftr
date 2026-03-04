
import  User from "../models/user.model.js"


export const getUserDetails = async (req, res) => {
    try {
        const { phone, org_id, role } = req.user;
        let user;
        if (role === "super_admin") {
            user = await User.findOne({ phone }).select("-password -updatedAt -createdAt");
        } else {
            user = await User.findOne({ org_id, phone }).select("-password");
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error"
        });
    }
};