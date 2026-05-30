
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


export const isDayOneValid = (packageDetails)=>{

    const adult = packageDetails?.regionDetails?.adults;
    const childAge = packageDetails?.regionDetails?.childAges
    const adultChild = childAge?.filter(v=>v>6)?.length;
    const childMax5Year = childAge?.filter(v=>v<=6)?.length;
    const totalAdults = adult + adultChild;
    const dayDetails = packageDetails?.itineraryBuilder?.daysDetails?.[0];
    const totalMaxAdults = dayDetails?.hotelDetails?.rooms?.reduce((acc,val)=>acc+((val?.maxAdults+val?.noOfExtraMattress)*val?.noOfRooms),0)
    const totalTakenCNB = dayDetails?.hotelDetails?.rooms?.reduce((acc,val)=>acc+(val?.noOfCnb),0)



    // Room Validation 
    if(totalMaxAdults < ( totalAdults + childMax5Year)){
        if(totalMaxAdults <  totalAdults){
            return {
                success:false,
                message:"You need to add more room"
            } 
        }

        if(childMax5Year > totalTakenCNB){
            return {
                success:false,
                message:"You need to add CNB for child"
            } 
        }
    }


    return {
        success:true,
        message:"All Validation passed"
    } 
}