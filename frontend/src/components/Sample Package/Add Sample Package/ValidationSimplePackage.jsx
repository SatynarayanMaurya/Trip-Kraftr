
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
    // console.log("region details : ",regionDetails)

    if (regionDetails?.children > 0) {
        const childAges = regionDetails?.childAges || [];
    
        const isValid =
            childAges.length === regionDetails.children &&
            childAges.every(age => Number(age) > 0);
    
        if (!isValid) {
            return {
                success: false,
                message: "Please enter a valid age for all children."
            };
        }
    }

    return {
        success: true,
        message: "All Validation true"
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
    const hotelType = dayDetails?.hotelDetails?.hotelType
    if(hotelType === 'manual'){
        return {
            success: true,
            message: "All Validation passed"
        }
    }
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


export const isValidVendorDetails = (vendorDetails) => {
    const {
        vendorName = '',
        vendorPrice = 0,
    } = vendorDetails || {};

    const hasVendorName = vendorName.trim() !== '';
    const hasVendorPrice = Number(vendorPrice) > 0;

    // If vendor name is provided, vendor price must be > 0
    if (hasVendorName && !hasVendorPrice) {
        return {
            success: false,
            message: "Please enter a valid vendor price."
        };
    }

    // If vendor price is provided, vendor name must be present
    if (hasVendorPrice && !hasVendorName) {
        return {
            success: false,
            message: "Please select or enter a vendor name."
        };
    }

    // Commission is optional, so no validation needed

    return {
        success: true,
        message: "All Validation true"
    };
};