import { toast } from "react-toastify";

const handleSaveVehicle = (formData) => {
    const { assignedTo, totalSeats, minSeats, selectedVehicleId } = formData.tripDetails;
    if (!assignedTo || !totalSeats || !minSeats || !selectedVehicleId) {
        return false;
    }
    return true
};



export const validateItinerary = (formData) => {
    // const tripDetails = formData?.tripDetails;
    const isTripDetailsValid = handleSaveVehicle(formData)
    console.log(" isTripDetailsValid",isTripDetailsValid)
    if(!isTripDetailsValid) return { isValid: false, message: 'Trip Details Missing' };
    
    const day1 = formData.itineraryBuilder?.daysDetails?.[0];

    if (!day1) {
        return { isValid: false, message: 'Day 1 data is missing.' };
    }

    // Sub-region check
    const hasSubRegion = [day1.subRegion1, day1.subRegion2, day1.subRegion3].some(Boolean);
    if (!hasSubRegion) {
        return { isValid: false, message: 'Day 1: Please select at least one Sub-Region.' };
    }

    const hotel = day1?.hotelDetails;

    // Hotel check
    const hasHotel = hotel?.hotelType === 'manual'
        ? !!hotel?.hotelName?.trim()
        : !!hotel?.hotelId;

    if (!hasHotel) {
        return { isValid: false, message: 'Day 1: Please select or enter a Hotel.' };
    }

    // Room type check
    const hasRoomType = hotel?.hotelType === 'manual'
        ? !!hotel?.roomType?.trim()
        : !!hotel?.roomType;

    if (!hasRoomType) {
        return { isValid: false, message: 'Day 1: Please select or enter a Room Type.' };
    }

    // Meals check
    const hasMeals = !!hotel?.meals?.trim();
    if (!hasMeals) {
        return { isValid: false, message: 'Day 1: Please select at least one Meal (Breakfast, Lunch, or Dinner).' };
    }

    // Place check
    const hasPlace = day1.placeDetails?.length > 0;
    if (!hasPlace) {
        return { isValid: false, message: 'Day 1: Please select at least one Place.' };
    }

    return { isValid: true };
};



export const ensureFavouritePlaces = (daysDetails) => {
    return daysDetails.map(day => {
        const places = day.placeDetails ?? [];
        if (places.length === 0) return day;

        const hasFavourite = places.some(p => p.isFavourite);
        if (hasFavourite) return day;

        return {
            ...day,
            placeDetails: places.map((p, i) => ({
                ...p,
                isFavourite: i === 0,
            })),
        };
    });
};