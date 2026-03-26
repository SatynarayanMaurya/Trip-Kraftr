import Room from '../models/room.model.js';
import Hotel from '../models/hotel.model.js';
import mongoose from 'mongoose';

export const addRoom = async (req, res) => {
    try {
        const { hotelId, roomName, capacity, adult, children } = req.body;

        // ✅ Validate hotelId existence
        if (!hotelId) {
            return res.status(400).json({
                success: false,
                message: "Hotel Id is required"
            });
        }

        // ✅ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(hotelId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Hotel Id"
            });
        }

        // ✅ Validate required fields
        if (!roomName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Room name is required"
            });
        }

        // Convert to numbers
        const cap = Number(capacity);
        const ad = Number(adult);
        const child = Number(children);

        // ✅ Validate numeric fields
        if ([cap, ad, child].some(val => isNaN(val))) {
            return res.status(400).json({
                success: false,
                message: "Capacity, adult and children must be valid numbers"
            });
        }

        // ✅ Validate non-negative values
        if (cap <= 0 || ad < 0 || child < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid capacity, adult or children values"
            });
        }

        // ✅ Business logic validation
        if (cap !== ad + child) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be equal to adult + children"
            });
        }

        // ✅ Create room
        const newRoom = await Room.create({
            org_id: req.user.org_id,
            hotelId,
            roomName: roomName.trim(),
            roomName_lower: roomName.trim().toLowerCase(),
            capacity: cap,
            adult: ad,
            children: child
        });

        return res.status(201).json({
            success: true,
            message: "Room added successfully",
            data: newRoom
        });

    } catch (error) {

        // ✅ Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Room already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};



export const getRoomsOfHotels = async(req,res)=>{
    try{
        const {hotelId} = req.query;
        console.log("Hotel Id : ",hotelId)
        if(!hotelId){
            return res.status(400).json({
                success:false,
                message:"Hotel Id not found"
            })
        }
        
        const allRooms = await Room.find({org_id:req.user.org_id,hotelId:hotelId}).select("_id roomName capacity adult children is_active hotelId")
        return res.status(200).json({
            success:true,
            message :"All Rooms are fetched",
            allRooms
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server error"
        })
    }
}