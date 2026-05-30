
export const isRegionDetailsValid = (packageDetails) => {
    const regionDetails = packageDetails?.regionDetails;

    if (!regionDetails?.region1) {
        return {
            success: false,
            message: "Please select at least one region."
        };
    }

    if (!regionDetails?.noOfDays) {
        return {
            success: false,
            message: "Please select the number of days for the package."
        };
    }

    if (!regionDetails?.startDate) {
        return {
            success: false,
            message: "Please choose a start date."
        };
    }

    if (!regionDetails?.adults) {
        return {
            success: false,
            message: "Please enter the number of adults."
        };
    }

    return {
        success: true
    };
};


export const isDayOneValid = (packageDetails) => {

    const adult = packageDetails?.regionDetails?.adults;
    const childAge = packageDetails?.regionDetails?.childAges
    const adultChildMax12 = childAge?.filter(v => v > 6 && v <= 12)?.length;
    const adultChildMin12 = childAge?.filter(v => v > 12)?.length;
    const totalAdults = adult + adultChildMin12;
    const dayDetails = packageDetails?.itineraryBuilder?.daysDetails?.[0];
    const totalMaxAdults = dayDetails?.hotelDetails?.rooms?.reduce((acc, val) => acc + ((val?.maxAdults + val?.noOfExtraMattress) * val?.noOfRooms), 0)
    const totalTakenCNB = dayDetails?.hotelDetails?.rooms?.reduce((acc, val) => acc + (val?.noOfCnb||0), 0)
    const remainingAdultSeats = totalMaxAdults - totalAdults

    // Room Validation 
    if (totalMaxAdults < totalAdults) {
        return {
            success: false,
            message: "You need to add more room in Day-1"
        }
    }

    if((remainingAdultSeats+totalTakenCNB) < adultChildMax12){
        return {
            success: false,
            message: "You need to add CNB for child in Day-1"
        }
    }


    return {
        success: true,
        message: "All Validation passed"
    }
}