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
            existingUser = await User.findOne({phone},"org_id name email phone password role is_active" ).populate({path:"org_id",select:"subscriptionStartDate subscriptionEndDate is_active"})
        }
        else{

        }

        if(!existingUser){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const getSubscriptionStatus = (org) => {
            const now = new Date();
            const start = new Date(org?.subscriptionStartDate);
            const end = new Date(org?.subscriptionEndDate);
        
            if (!org?.is_active) {
                return { allowed: false, reason: "org_inactive" };
            }
            if (now < start) {
                return { allowed: false, reason: "subscription_not_started", start, end };
            }
            if (now > end) {
                return { allowed: false, reason: "subscription_expired", start, end };
            }
            return { allowed: true };
        }
        const subscriptionStatus = getSubscriptionStatus(existingUser.org_id);

        if(!subscriptionStatus?.allowed && existingUser?.role !=='super_admin'){
            let message;
            switch(subscriptionStatus?.reason){
                case "org_inactive":
                    message = "Your organization is inactive. Please contact your administrator.";
                    break;
                case "subscription_not_started":
                    message = `Your organization subscription will start on ${subscriptionStatus?.start.toDateString()}.`;
                    break;
                case "subscription_expired":
                    message = `Your organization subscription expired on ${subscriptionStatus?.end.toDateString()}. Please contact support.`;
                    break;
                default:
                    message = "Access denied due to subscription status.";
            }

            return res.status(403).json({ success: false, message });
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
                org_id:existingUser?.org_id?._id || null,
                phone:existingUser?.phone,
                role:existingUser?.role||'customer',
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

        const userSafe = existingUser.toObject();
        delete userSafe.password;

        return res.cookie("token",token,cookieOption).status(200).json({
            success:true,
            message:"User login successfull",
            user:userSafe,
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

export const logout = async (req, res) => {
    try{
        res.clearCookie("token", { 
            httpOnly: true, 
            secure: process.env.NODE_ENV==="production", 
            sameSite: process.env.NODE_ENV==="production" ? "None" : "Lax", 
            path: "/" 
        });
        return res.status(200).json({success:true, message: "Logged out successfully 🥺" });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in logout in backend ",
            errorMessage:error.message
        })
    }
}