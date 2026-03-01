 export const defaultRoles = [
    {
      name: "org_admin",
      permissions: [
        "manage_hotels",
        "manage_vehicles",
        "manage_users",
        "create_itinerary",
        "edit_itinerary",
        "delete_itinerary",
        "view_itinerary"
      ]
    },
    {
      name: "travel_consultant",
      permissions: [
        "create_itinerary",
        "edit_itinerary",
        "view_itinerary"
      ]
    },
    {
      name: "sales_consultant",
      permissions: ["view_itinerary"]
    },
    {
      name: "customer",
      permissions: ["view_itinerary"]
    }
  ];