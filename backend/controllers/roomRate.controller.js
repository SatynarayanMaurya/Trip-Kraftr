import Room from '../models/room.model.js';
import Hotel from '../models/hotel.model.js';
import mongoose from 'mongoose';
import RoomRate from "../models/roomRate.model.js"

export const addRoomRate = async (req, res) => {
    try {
      const {
        ratePlanName,
        hotelId,
        fromDate,
        toDate,
        roomRates,
        extraMattress,
        cnb,
      } = req.body;
  
      // 🔹 Basic validation
      if (!hotelId) {
        return res.status(400).json({
          success: false,
          message: "Hotel Id not found",
        });
      }
  
      if (!ratePlanName || !fromDate || !toDate || !roomRates) {
        return res.status(400).json({
          success: false,
          message: "Required fields are missing",
        });
      }
  
      const newFromDate = new Date(fromDate);
      const newToDate = new Date(toDate);
  
      // 🔴 Date validation
      if (newFromDate > newToDate) {
        return res.status(400).json({
          success: false,
          message: "fromDate cannot be greater than toDate",
        });
      }
  
      // 🔴 CHECK OVERLAPPING DATE RANGE
      const existingRate = await RoomRate.findOne({
        org_id: req.user.org_id,
        hotelId: hotelId,
        isActive: true,
        $or: [
          {
            fromDate: { $lte: newToDate },
            toDate: { $gte: newFromDate },
          },
        ],
      });
  
      if (existingRate) {
        return res.status(409).json({
          success: false,
          message:
            "Room rate already exists for the selected date range. Please update existing rate.",
        });
      }
  
      // ✅ Create new room rate
      const newRoomRate = await RoomRate.create({
        org_id: req.user.org_id,
        hotelId,
        ratePlanName,
        fromDate: newFromDate,
        toDate: newToDate,
        roomRates,
        extraMattress,
        cnb,
      });
  
      return res.status(201).json({
        success: true,
        message: "Room rate added successfully",
        data: newRoomRate,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate entry found",
        });
      }
  
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
};


export const getRoomRates = async(req,res)=>{
    try{
        const {hotelId} = req.params;
        if(!hotelId){
            return res.status(400).json({
                success:false,
                message :"Hotel Id not found"
            })
        }

        
        const allRoomRates = await RoomRate.find({org_id:req.user.org_id,hotelId:hotelId}).select("_id ratePlanName fromDate toDate roomRates extraMattress cnb")
        return res.status(200).json({
            success:true,
            message:"Room Rate fetched",
            allRoomRates
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error?.message || "Internal Server Error"
        })
    }
}