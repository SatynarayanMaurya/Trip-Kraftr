
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
    const adult = packageDetails?.regionDetails?.adults || 0;
    const childAge = packageDetails?.regionDetails?.childAges || [];

    const adultChildMax12 = childAge.filter(v => v > 6 && v <= 12).length;
    const adultChildMin12 = childAge.filter(v => v > 12).length;

    const totalAdults = adult + adultChildMin12;

    const daysDetails = packageDetails?.itineraryBuilder?.daysDetails || [];

    for (let i = 0; i < daysDetails.length; i++) {

        const dayDetails = daysDetails[i];
        const hotelDetails = dayDetails?.hotelDetails;

        // Day-1 hotel mandatory, other days skip if no hotel
        if (!hotelDetails && i === 0) {
            return {
                success: false,
                message: "Hotel is required in Day-1"
            };
        }

        if (!hotelDetails || !hotelDetails?.hotelName) continue;


        // Skip manual hotel validation
        if (hotelDetails?.hotelType === "manual") {
            continue;
        }


        const rooms = hotelDetails?.rooms || [];

        const totalMaxAdults = rooms.reduce(
            (acc, val) =>
                acc + ((val?.maxAdults + val?.noOfExtraMattress) * val?.noOfRooms),
            0
        );

        const totalTakenCNB = rooms.reduce(
            (acc, val) => acc + (val?.noOfCnb || 0),
            0
        );


        const remainingAdultSeats = totalMaxAdults - totalAdults;


        // Room validation
        if (totalMaxAdults < totalAdults) {
            return {
                success: false,
                message: `You need to add more room in Day-${i + 1}`
            };
        }


        // CNB validation
        if ((remainingAdultSeats + totalTakenCNB) < adultChildMax12) {
            return {
                success: false,
                message: `You need to add CNB for child in Day-${i + 1}`
            };
        }
    }


    return {
        success: true,
        message: "All Validation passed"
    };
};

export const isAllDayValid = (packageDetails) => {
    const adult = packageDetails?.regionDetails?.adults || 0;
    const childAge = packageDetails?.regionDetails?.childAges || [];

    const adultChildMax12 = childAge.filter(v => v > 6 && v <= 12).length;
    const adultChildMin12 = childAge.filter(v => v > 12).length;

    const totalAdults = adult + adultChildMin12;

    const daysDetails = packageDetails?.itineraryBuilder?.daysDetails || [];

    for (let i = 0; i < daysDetails.length; i++) {
        const dayDetails = daysDetails[i];
        const hotelDetails = dayDetails?.hotelDetails;
        const isLastDay = i === daysDetails.length - 1;

        // All days except last day require a hotel
        if (!isLastDay && (!hotelDetails || !hotelDetails.hotelName)) {
            return {
                success: false,
                message: `Hotel is required in Day-${i + 1}`
            };
        }

        // Last day: hotel is optional
        if (!hotelDetails || !hotelDetails.hotelName) {
            continue;
        }

        // Manual hotel -> skip room validation
        if (hotelDetails.hotelType === "manual") {
            continue;
        }

        const rooms = hotelDetails.rooms || [];

        const totalMaxAdults = rooms.reduce(
            (acc, room) =>
                acc +
                (((room?.maxAdults || 0) + (room?.noOfExtraMattress || 0)) *
                    (room?.noOfRooms || 0)),
            0
        );

        const totalTakenCNB = rooms.reduce(
            (acc, room) => acc + (room?.noOfCnb || 0),
            0
        );

        const remainingAdultSeats = totalMaxAdults - totalAdults;

        if (totalMaxAdults < totalAdults) {
            return {
                success: false,
                message: `You need to add more room in Day-${i + 1}`
            };
        }

        if (remainingAdultSeats + totalTakenCNB < adultChildMax12) {
            return {
                success: false,
                message: `You need to add CNB for child in Day-${i + 1}`
            };
        }
    }

    return {
        success: true,
        message: "All Validation passed"
    };
};

export const isCurrentDayValid = (packageDetails, activeDay = 1) => {
    const adult = packageDetails?.regionDetails?.adults || 0;
    const childAge = packageDetails?.regionDetails?.childAges || [];

    const adultChildMax12 = childAge.filter(v => v > 6 && v <= 12).length;
    const adultChildMin12 = childAge.filter(v => v > 12).length;

    const totalAdults = adult + adultChildMin12;

    const dayDetails =
        packageDetails?.itineraryBuilder?.daysDetails?.[activeDay - 1];

    // If the day doesn't exist, nothing to validate
    if (!dayDetails) {
        return {
            success: true,
            message: "All Validation passed"
        };
    }

    const hotelDetails = dayDetails?.hotelDetails;

    // Hotel is mandatory only for Day 1
    if (activeDay === 1 && !hotelDetails) {
        return {
            success: false,
            message: "Hotel is required in Day-1"
        };
    }

    // Other days: if no hotel selected, skip validation
    if (!hotelDetails || !hotelDetails?.hotelName) {
        return {
            success: true,
            message: "All Validation passed"
        };
    }

    // Skip manual hotel validation
    if (hotelDetails?.hotelType === "manual") {
        return {
            success: true,
            message: "All Validation passed"
        };
    }

    const rooms = hotelDetails?.rooms || [];

    const totalMaxAdults = rooms.reduce(
        (acc, room) =>
            acc +
            ((room?.maxAdults || 0) + (room?.noOfExtraMattress || 0)) *
                (room?.noOfRooms || 0),
        0
    );

    const totalTakenCNB = rooms.reduce(
        (acc, room) => acc + (room?.noOfCnb || 0),
        0
    );

    const remainingAdultSeats = totalMaxAdults - totalAdults;

    if (totalMaxAdults < totalAdults) {
        return {
            success: false,
            message: `You need to add more room in Day-${activeDay}`
        };
    }

    if (remainingAdultSeats + totalTakenCNB < adultChildMax12) {
        return {
            success: false,
            message: `You need to add CNB for child in Day-${activeDay}`
        };
    }

    return {
        success: true,
        message: "All Validation passed"
    };
};

export const isVehicleValid = (packageDetails) => {
    const adult = packageDetails?.regionDetails?.adults || 0;
    const childAge = packageDetails?.regionDetails?.childAges || [];

    const adultChildMax12 = childAge.filter(v => v > 6 && v <= 12).length;
    const adultChildMin12 = childAge.filter(v => v > 12).length;

    const totalAdults = adult + adultChildMin12 + adultChildMax12;

    const daysDetails = packageDetails?.itineraryBuilder?.daysDetails || [];


    for (let i = 0; i < daysDetails.length; i++) {

        const vehicleDetails = daysDetails[i]?.vehicleDetails || [];


        // Skip if no vehicle added
        if (!vehicleDetails.length || !vehicleDetails?.[0]?.vehicleId) continue;


        const totalVehicleCapacity = vehicleDetails.reduce(
            (acc, vehicle) =>
                acc + ((vehicle?.capacity || 0) * (vehicle?.quantity || 1)),
            0
        );


        if (totalVehicleCapacity < totalAdults) {
            return {
                success: false,
                message: `You need to add more Vehicle in Day-${i + 1}`
            };
        }
    }


    return {
        success: true,
        message: "All Validation passed"
    };
};

export const isCurrentDayVehicleValid = (packageDetails, activeDay = 1) => {
    const adult = packageDetails?.regionDetails?.adults || 0;
    const childAge = packageDetails?.regionDetails?.childAges || [];

    const adultChildMax12 = childAge.filter(v => v > 6 && v <= 12).length;
    const adultChildMin12 = childAge.filter(v => v > 12).length;

    const totalPassengers = adult + adultChildMin12 + adultChildMax12;

    const dayDetails = packageDetails?.itineraryBuilder?.daysDetails?.[activeDay - 1];

    // Day doesn't exist -> nothing to validate
    if (!dayDetails) {
        return {
            success: true,
            message: "All Validation passed"
        };
    }

    const vehicleDetails = dayDetails?.vehicleDetails || [];

    // No vehicle selected -> skip validation
    if (!vehicleDetails.length || !vehicleDetails[0]?.vehicleId) {
        return {
            success: true,
            message: "All Validation passed"
        };
    }

    const totalVehicleCapacity = vehicleDetails.reduce(
        (acc, vehicle) =>
            acc + ((vehicle?.capacity || 0) * (vehicle?.quantity || 1)),
        0
    );

    if (totalVehicleCapacity < totalPassengers) {
        return {
            success: false,
            message: `You need to add more Vehicle in Day-${activeDay}`
        };
    }

    return {
        success: true,
        message: "All Validation passed"
    };
};

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