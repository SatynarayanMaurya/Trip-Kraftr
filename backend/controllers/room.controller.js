import Room from '../models/room.model.js';
import Hotel from '../models/hotel.model.js';
import mongoose from 'mongoose';
import RoomRate from "../models/roomRate.model.js"

export const addRoom = async (req, res) => {
    try {
        const { hotelId, roomName, capacity, adult, quantity,extraMattress,imageLink } = req.body;

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
        const qty = Number(quantity);
        const extraMat = Number(extraMattress);

        // ✅ Validate numeric fields
        if ([cap, ad,extraMat].some(val => isNaN(val))) {
            return res.status(400).json({
                success: false,
                message: "Capacity, adult and children must be valid numbers"
            });
        }

        // ✅ Validate non-negative values
        if (cap <= 0 || ad < 0 || extraMat < 0 ) {
            return res.status(400).json({
                success: false,
                message: "Invalid capacity, adult or extra Mattress values"
            });
        }

        // ✅ Business logic validation
        if (cap !== ad + extraMat) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be equal to adult + Extra Mattress"
            });
        }

        const result = await Room.create({
            org_id: req.user.org_id,
            hotelId,
            roomName: roomName.trim(),
            roomName_lower: roomName.trim().toLowerCase(),
            capacity: cap,
            adult: ad,
            quantity:qty,
            extraMattress:extraMat,
            imageLink:imageLink||null
        });

        const newRoom = {
            _id: result._id,
            roomName: result.roomName,
            adult: result.adult,
            capacity: result.capacity,
            extraMattress: result.extraMattress,
            imageLink: result.imageLink,
            hotelId: result.hotelId
        };

        await RoomRate.updateMany(
            {
                org_id: req.user.org_id,
                hotelId: hotelId
            },
            {
                $push: {
                    roomRates: {
                        roomId: result._id,
                        roomName: result.roomName, // optional
                        ep: 0,
                        cp: 0,
                        map: 0,
                        ap: 0
                    }
                }
            }
        );

        return res.status(201).json({
            success: true,
            message: "Room added successfully",
            newRoom
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



export const getRoomsOfHotels = async (req, res) => {
    try {
        const { hotelId } = req.query;
        if (!hotelId) {
            return res.status(400).json({
                success: false,
                message: "Hotel Id not found"
            })
        }

        const allRooms = await Room.find({ org_id: req.user.org_id, hotelId: hotelId }).select("_id roomName quantity capacity adult is_active hotelId extraMattress imageLink")
        return res.status(200).json({
            success: true,
            message: "All Rooms are fetched",
            allRooms
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server error"
        })
    }
}


export const getRoomsTypeForHotelId = async (req, res) => {
    try {
      const hotelId = req.query.hotelId;
  
      const allRoomType = await Room
        .find({
          org_id: req.user.org_id,
          hotelId: new mongoose.Types.ObjectId(hotelId),
        })
        .sort({ createdAt: -1 })
        .lean()
        .select("_id roomName quantity adult capacity extraMattress")
  
      return res.status(200).json({
        success: true,
        message: "Rooms Type fetched successfully",
        allRoomType
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal Server Error"
      });
    }
};



export const updateRoomById = async (req, res) => {
    try {
        const { hotelId, roomId, roomName, capacity, adult, children,quantity ,extraMattress,imageLink} = req.body
        if (!hotelId) {
            return res.status(400).json({
                success: false,
                message: "Hotel Id is required"
            });
        }

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room Id not found"
            })
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
        const qty = Number(quantity);
        const extraMat = Number(extraMattress);

        // ✅ Validate numeric fields
        if ([cap, ad, extraMat].some(val => isNaN(val))) {
            return res.status(400).json({
                success: false,
                message: "Capacity, adult and children must be valid numbers"
            });
        }

        // ✅ Validate non-negative values
        if (cap <= 0 || ad < 0 || extraMat < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid capacity, adult or Extra Mattress values"
            });
        }

        // ✅ Business logic validation
        if (cap !== ad + extraMat) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be equal to adult + Extra Mattress"
            });
        }

        const updatedRoom = await Room.findOneAndUpdate(
            { 
                org_id: req.user.org_id, 
                hotelId: hotelId, 
                _id: roomId 
            }, 
            { 
                $set: 
                    { 
                        roomName: roomName?.trim(), 
                        roomName_lower: roomName?.trim()?.toLowerCase(),
                        quantity:qty, 
                        capacity: cap,
                        extraMattress:extraMat,
                        imageLink, 
                        adult: ad, 
                    } 
            }, 
            { new: true })
            .select("_id roomName quantity capacity adult hotelId extraMattress imageLink")

        if (updatedRoom) {
            return res.status(200).json({
                success: true,
                message: "Room Updated",
                updatedRoom
            })
        }
        else {
            return res.status(404).json({
                success: false,
                message: "Room Not found"
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}

export const deleteRoomById = async (req, res) => {
    try {
        const { hotelId, roomId } = req.body;

        if (!hotelId || !roomId) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing",
            });
        }

        // 1. Delete Room
        const deletedRoom = await Room.findOneAndDelete({
            org_id: req.user.org_id,
            hotelId: hotelId,
            _id: roomId,
        });

        if (!deletedRoom) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        // 2. Remove room from all RoomRates
        await RoomRate.updateMany(
            {
                org_id: req.user.org_id,
                hotelId: hotelId,
            },
            {
                $pull: {
                    roomRates: { roomId: roomId },
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Room Deleted Successfully",
            deletedRoom
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
};