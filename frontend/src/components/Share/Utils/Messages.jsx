// utils/getWhatsappMessage.js

export const getWhatsappMessage = (data = {}, tripType = "privateTrip") => {

    const addDays = (date, days = 0) => {
        if (!date) return "";

        const d = new Date(date);
        d.setDate(d.getDate() + days);

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        }).format(d);
    };

    const itineraryLink = getUrl(data, tripType)

    const travelerName = data?.enquiryId?.accountId?.bussinessName || data?.enquiryId?.accountId?.fullName || 'John Doe' || "{{travelerName}}";

    const tripName = data?.itineraryBuilder?.tripName || "{{tripName}}";

    const duration = data?.regionDetails?.noOfDays || "{{duration}}";

    const startDate = (data?.regionDetails?.startDate ? addDays(data?.regionDetails?.startDate, 0) : addDays(data?.regionDetails?.fromDate, 0)) || "{{startDate}}"

    const endDate = (data?.regionDetails?.startDate ? addDays(data?.regionDetails?.startDate, data?.regionDetails?.noOfDays - 1) : addDays(data?.regionDetails?.toDate, 0)) || "{{endDate}}"

    const destination = data?.regionDetails?.region1?.name || "{{destination}}";

    const totalAmount = data?.price?.discountedPrice || data?.price?.finalPrice || `${data?.tripDetails?.occupancy?.single} Single` || "{{totalAmount}}";

    const currency = data?.pricing?.currency || "₹";

    const organizationName = data?.organization?.name || "Mezenga";

    return `Hi ${travelerName}! 👋

Your personalized itinerary is ready! ✨

🧳 *${tripName}*
📍 Destination: ${destination}
📅 Dates: ${startDate} – ${endDate}
🗓️ Duration: ${duration}
💰 Total Trip Cost: ${currency}${totalAmount}

🔗 View your itinerary:
${itineraryLink}

Need any changes? Just reply to this message—we're happy to help.

Have a wonderful trip! 🌍

— ${organizationName}`;
};


export const getUrl = (data = {}, tripType) => {

    const urlMap = {
        privateTrip: `private-trip/${data?._id}`,
        samplePackage: `sample-package/${data?._id}`,
        groupTrip: `group-trip/${data?._id}`,
    };

    const HOST =
        typeof window !== "undefined"
            ? window.location.origin
            : "https://mezenga.com";

    return `${HOST}/${urlMap[tripType] || ""}`;

}


export const getMailContent = (data = {}, tripType = "privateTrip") => {

    const addDays = (date, days = 0) => {
        if (!date) return "";

        const d = new Date(date);
        d.setDate(d.getDate() + days);

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        }).format(d);
    };


    const itineraryLink = getUrl(data, tripType);


    const travelerName =
        data?.enquiryId?.accountId?.bussinessName ||
        data?.enquiryId?.accountId?.fullName ||
        "John Doe";


    const tripName =
        data?.itineraryBuilder?.tripName ||
        "Your Trip";


    const duration =
        data?.regionDetails?.noOfDays ||
        "-";


    const startDate =
        (
            data?.regionDetails?.startDate
                ? addDays(data?.regionDetails?.startDate, 0)
                : addDays(data?.regionDetails?.fromDate, 0)
        ) || "-";


    const endDate =
        (
            data?.regionDetails?.startDate
                ? addDays(
                    data?.regionDetails?.startDate,
                    data?.regionDetails?.noOfDays - 1
                )
                : addDays(data?.regionDetails?.toDate, 0)
        ) || "-";


    const destination =
        data?.regionDetails?.region1?.name ||
        "-";


    const totalAmount =
        data?.price?.discountedPrice ||
        data?.price?.finalPrice ||
        `${data?.tripDetails?.occupancy?.single || ""} Single` ||
        "-";


    const currency =
        data?.pricing?.currency ||
        "₹";


    const organizationName =
        data?.organization?.name ||
        "Mezenga";


    const subject = `Your ${tripName} itinerary is ready ✨`;
    const from='satynarayanmaurya989@gmail.com'
    const to=data?.enquiryId?.accountId?.email ||'manojmaurya1123@gmail.com'


    const body = `
Hi ${travelerName},

We are excited to share your personalized itinerary for your upcoming trip.

Trip Details:

🧳 Trip Name: ${tripName}
📍 Destination: ${destination}
📅 Travel Dates: ${startDate} - ${endDate}
🗓️ Duration: ${duration}
💰 Total Trip Cost: ${currency}${totalAmount}

🔗 View your complete itinerary:
${itineraryLink}


Need any changes? Feel free to reply to this email.
Our team will be happy to assist you.


Have a wonderful trip! 🌍

Regards,
${organizationName} Team
    `.trim();


    return {
        from: `${from}`,
        to: `${to}`,
        subject,
        body,
    };
};