
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"
export const authMiddlewareWithAllChecks = async (req ,res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(404).json({
                success:false,
                message:'Token not found'
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decode;
            const existingUser = await User.findOne({phone:decode?.phone},"org_id name email phone role is_active" ).populate({path:"org_id",select:"subscriptionStartDate subscriptionEndDate is_active"})
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
            const subscriptionStatus = getSubscriptionStatus(existingUser?.org_id);
    
            if(!subscriptionStatus?.allowed && decode?.role !== 'super_admin'){
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

            next()
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:error?.message||"Token invalid"
            })
        }

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Error in authMiddleware with all checks"
        })
    }
}