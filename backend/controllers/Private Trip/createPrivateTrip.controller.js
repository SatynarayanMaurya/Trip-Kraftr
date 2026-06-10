import PrivateTrip from "../../models/Private Trip/privateTrip.model.js"
import PrivateTripFinance from "../../models/Private Trip/privateTripfinances.model.js"

const calculateHotelPrice = (rooms) => {

    return rooms.reduce((roomAcc, room) => {

        const roomPrice = (room?.roomPrice || 0) * (room?.noOfRooms || 1);

        const extraMattressPrice = (room?.extraMattressPrice || 0) * (room?.noOfExtraMattress || 0);

        const cnbPrice = (room?.cnbPrice || 0) * (room?.noOfCnb || 0);

        return (
            roomAcc +
            roomPrice +
            extraMattressPrice +
            cnbPrice
        );
    }, 0);
}


export const createPrivateTrip = async (req, res) => {
    try {
        const { regionDetails, itineraryBuilder, price, enquiryDetails, enquiryType } = req.body;

        if (!regionDetails || !itineraryBuilder || !enquiryDetails || !price) {
            return res.status(400).json({
                success: false,
                message: "Required field are missing"
            })
        }
        const latestPackage = await PrivateTrip
            .findOne({ org_id: req.user.org_id })
            .sort({ createdAt: -1 })
            .select("privateTripId")

        const latestId = latestPackage?.privateTripId?.split("-")?.[1]
        const privateTripId = `PRTRIP-${(Number(latestId) || 0) + 1}`

        const enquiryModel = enquiryType === 'b2c' ? 'B2CEnquiry' : 'B2BEnquiry';

        const allHotels = itineraryBuilder?.daysDetails?.map((val) => val?.hotelDetails?.hotelType === "inventory" ?
            {
                hotelId: val?.hotelDetails?.hotelId,
                hotelName: val?.hotelDetails?.hotelName,
                price: calculateHotelPrice(val?.hotelDetails?.rooms)
            } :
            {
                hotelId: null,
                hotelName: val?.hotelDetails?.hotelName,
                price: calculateHotelPrice(val?.hotelDetails?.rooms)
            })

        // console.log("all Hotels : ", allHotels)
        const mergedHotels = Object.values(
            allHotels.reduce((acc, hotel) => {
                if (!hotel?.hotelId && !hotel?.hotelName) {
                    return acc;
                }

                // Use hotelId if present, otherwise hotelName
                const key = hotel.hotelId || hotel.hotelName;

                if (!acc[key]) {
                    acc[key] = {
                        hotelId: hotel.hotelId,
                        hotelName: hotel.hotelName,
                        price: 0,
                    };
                }

                acc[key].price += hotel.price || 0;

                return acc;
            }, {})
        );

        // console.log("mergedHotels : ", mergedHotels);
        const allVehicles = itineraryBuilder?.daysDetails?.flatMap(day =>
            day?.vehicleDetails
                ?.filter(vehicle => vehicle?.vehicleId) // or vehicle?.vehicle?.vehicleId depending on structure
                .map(vehicle => ({
                    vehicleModel: vehicle?.vehicleModel,
                    vehicleId: vehicle.vehicleId,
                    price: vehicle.pricePerDay,
                })) || []
        );

        // console.log("allVehicles : ",allVehicles)
        const mergedVehicles = Object.values(
            allVehicles.reduce((acc, vehicle) => {
                const { vehicleId, vehicleModel, price } = vehicle;

                if (!acc[vehicleId]) {
                    acc[vehicleId] = {
                        vehicleId,
                        vehicleModel,
                        price: 0,
                    };
                }

                acc[vehicleId].price += price;

                return acc;
            }, {})
        );

        //   console.log("mergedVehicles : ",mergedVehicles);
        const newPrivateTrip = await PrivateTrip.create({
            org_id: req.user.org_id,
            privateTripId,
            regionDetails,
            itineraryBuilder,
            price,
            enquiryType: enquiryType,
            enquiryModel,
            enquiryId: enquiryDetails?._id
        });



        await newPrivateTrip.populate({
            path: 'enquiryId',
            select: '_id accountId',
            populate: {
                path: 'accountId',
                select: '_id fullName businessName phone email'
            }
        })

        if(newPrivateTrip){
            await PrivateTripFinance.create({
                org_id: req.user.org_id,
                privateTripId: newPrivateTrip?._id,
              
                hotelPayments: mergedHotels.map(hotel => ({
                  hotelId: hotel.hotelId || undefined,
                  hotelName: hotel.hotelName,
                  price: hotel.price,
                  payments: [],
                })),
              
                vehiclePayments: mergedVehicles.map(vehicle => ({
                  vehicleId: vehicle.vehicleId,
                  price: vehicle.price,
                  payments: [],
                })),
              });
        }

        return res.status(201).json({
            success: true,
            message: "New Private trip Created",
            newPrivateTrip
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}