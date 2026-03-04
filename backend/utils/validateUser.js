
const getSubscriptionStatus = (org) => {
    const now = new Date();
    const start = new Date(org.subscriptionStartDate);
    const end = new Date(org.subscriptionEndDate);

    if (!org.is_active) {
        return { allowed: false, reason: "org_inactive" };
    }
    if (now < start) {
        return { allowed: false, reason: "subscription_not_started", start, end };
    }
    if (now > end) {
        return { allowed: false, reason: "subscription_expired", start, end };
    }
    return { allowed: true };
}

const subscriptionStatus = getSubscriptionStatus(existingUser.org_id);

if(!subscriptionStatus.allowed){
    let message;
    switch(subscriptionStatus.reason){
        case "org_inactive":
            message = "Your organization is inactive. Please contact your administrator.";
            break;
        case "subscription_not_started":
            message = `Your organization subscription will start on ${subscriptionStatus.start.toDateString()}.`;
            break;
        case "subscription_expired":
            message = `Your organization subscription expired on ${subscriptionStatus.end.toDateString()}. Please contact support.`;
            break;
        default:
            message = "Access denied due to subscription status.";
    }

    return res.status(403).json({ success: false, message });
}