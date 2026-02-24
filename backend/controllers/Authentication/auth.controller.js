import User from "../../models/user.model.js"
import bcryptjs from "bcryptjs"

const isProduction = process.env.NODE_ENV === 'production'

export const signup = async (req, res) => {
    try {
        const { name, password, phone } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone number and password are required to proceed with registration."
            })
        }

        if (phone !== process.env.SUPER_ADMIN_PHONE) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to register as a Super Administrator."
            })
        }

        const existingUser = await User.findOne({ phone })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this phone number already exists."
            })
        }

        const hashpassword = await bcryptjs.hash(password, 10)

        const newUser = await User.create({
            name,
            phone,
            password: hashpassword,
            role: 'super_admin'
        })

        return res.status(201).json({
            success: true,
            message: "Super Administrator account has been successfully created.",
            data: newUser
        })

    } catch (error) {
        !isProduction && console.log("Error in signup:", error)

        return res.status(500).json({
            success: false,
            message: error?.message ||"An unexpected error occurred while processing the registration request. Please try again later."
        })
    }
}