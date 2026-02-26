
import jwt from 'jsonwebtoken'

export const authMiddleware = async(req,res,next)=>{
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
            console.log("decode : ",decode)
            next();

        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:error?.message||"Token invalid"
            })
        }
    }
    catch(error){
        console.log("Error in auth middleware : ",error)
        return res.status(401).json({
            success:false,
            message:error?.message || "Internal server error"
        })
    }
}