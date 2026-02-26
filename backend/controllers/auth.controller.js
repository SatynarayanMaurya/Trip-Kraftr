import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'

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


export const login = async(req,res)=>{
    try{

        const {role, phone,password} = req.body;
        if(!role || !phone || !password){
            return res.status(400).json({
                success:false,
                message:"Required field are missing"
            })
        }

        let existingUser;
        if(role === "staff"){
            existingUser = await User.findOne({phone})
        }
        else{

        }

        if(!existingUser){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const matchPassword = await bcryptjs.compare(password,existingUser?.password)

        if(!matchPassword){
            return res.status(401).json({
                success:false,
                message:"Password not matched"
            })
        }

        const token = jwt.sign(
            {
                userId:existingUser?._id,
                org_id:existingUser?.org_id || null,
                phone:existingUser?.phone,
                email:existingUser?.email||null,
                is_active:existingUser?.is_active
            },
            process.env.JWT_SECRET,
            {
                expiresIn:'7d'
            }
        )

        const cookieOption = {
            httpOnly:true,
            sameSite:isProduction?"None":"Lax",
            secure:isProduction,
            path:"/",
            maxAge:7*24*60*60*1000,
            priority: "high"
        }

        existingUser.last_login = Date.now();
        await existingUser.save()

        return res.cookie("token",token,cookieOption).status(200).json({
            success:true,
            message:"User login successfull",
            user:existingUser,
            token:token
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal server error"
        })
    }
}