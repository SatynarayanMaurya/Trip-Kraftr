import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    useActivitiesData, useHotelsData, usePlacesData,
    useRegionsData, useRoomTypesData, useSubRegionsData, useVehiclesData
} from '../../hooks/Resuable Hooks/useResuableData';
import RegionDetails from './Add Group Trip/RegionDetails';
import TripDetails from './Add Group Trip/TripDetails';
import ItineraryBuilder from './Add Group Trip/ItineraryBuilder';

const PINK = '#ED5F8D';
const BLUE = '#18305C';

// ─── blank day template ───────────────────────────────────────────────────────
const blankDay = () => ({
    dayOverview: '',
    subRegion1: '',
    subRegion2: '',
    subRegion3: '',
    hotelDetails: {
        hotelType: 'inventory',
        hotelId: '',
        hotelName: '',
        roomTypeId: '',
        roomType:'',
        meals: '',
    },
    placeDetails: [],
    activities: [
        { activityType: 'inventory', activityId: '', activityName: '', isComplimentary: false, price: 0 }
    ],
});

function sortIdsConsistently(arr) {
    return [...arr].sort((a, b) => a.localeCompare(b));
}

function AddGroupTrip() {

    const [activeTab, setActiveTab] = useState(1);
    const [activeDay, setActiveDay] = useState(1);

    const [formData, setFormData] = useState({
        regionDetails: {
            region1: '',
            region2: '',
            region3: '',
            fromDate: '',
            toDate: '',
            noOfDays: '',
        },
        tripDetails: {
            assignedTo: '',
            totalSeats: '',
            minSeats: '',
            occupancy: { single: '', double: '', triple: '' },
            selectedVehicleId: '',
            quantity: 1,
        },
        itineraryBuilder: {
            tripOverview: '',
            daysDetails: [],
        },
    });

    // ─── computed ────────────────────────────────────────────────────────────

    const { region1, region2, region3, fromDate, toDate } = formData.regionDetails;
    const selectedRegionIds = [region1, region2, region3].filter(Boolean);
    const sortedRegionId = sortIdsConsistently(selectedRegionIds);

    const numDays = (() => {
        if (fromDate && toDate) {
            const diff = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24);
            return diff > 0 ? Math.round(diff) : 0;
        }
        return 0;
    })();

    // When numDays changes, rebuild daysDetails array (preserve existing data)
    useEffect(() => {
        if (numDays > 0) {
            setFormData(prev => {
                const existing = prev.itineraryBuilder.daysDetails;
                const newDays = Array.from({ length: numDays }, (_, i) => existing[i] ?? blankDay());
                return {
                    ...prev,
                    regionDetails: { ...prev.regionDetails, noOfDays: numDays },
                    itineraryBuilder: { ...prev.itineraryBuilder, daysDetails: newDays },
                };
            });
        }
    }, [numDays]);

    // ─── active day sub-regions for fetching ─────────────────────────────────

    const activeDayData = formData.itineraryBuilder.daysDetails?.[activeDay - 1];
    const { subRegion1, subRegion2, subRegion3 } = activeDayData ?? {};
    const selectedSubRegionIds = [subRegion1, subRegion2, subRegion3].filter(Boolean);
    const sortedSubRegionId = sortIdsConsistently(selectedSubRegionIds);

    // ─── selectors ───────────────────────────────────────────────────────────

    const { regions, loading: regionLoading } = useRegionsData();
    const allSubRegions = useSelector(s => s.subRegion.subRegionByRegionKey?.[sortedRegionId.join(',')]);
    const allVehicles = useSelector(s => s.vehicle.vehiclesByRegionKey?.[sortedRegionId.join(',')]);
    const hotelsForActiveDay = useSelector(s => s.hotel.hotelsBysubRegionKey?.[sortedSubRegionId.join(',')]);
    const placesForActiveDay = useSelector(s => s.place.placesBySubRegionKey?.[sortedSubRegionId.join(',')]);
    const activitiesForActiveDay = useSelector(s => s.activity.activitiesBySubRegionKey?.[sortedSubRegionId.join(',')]);
    const activeHotelId = activeDayData?.hotelDetails?.hotelId;
    const roomTypesForActiveDay = useSelector(s => s.room.roomTypesForHotelId?.[activeHotelId]);

    // ─── conditional fetches ─────────────────────────────────────────────────

    const { loading: vehicleLoading } = useVehiclesData({
        regionIds: sortedRegionId,
        enabled: activeTab === 2 && selectedRegionIds.length > 0,
    });
    const { loading: subRegionLoading } = useSubRegionsData({
        regionIds: sortedRegionId,
        enabled: activeTab === 3 && selectedRegionIds.length > 0,
    });
    const shouldFetchHotel = activeTab === 3 && selectedSubRegionIds.length > 0;
    const { loading: hotelLoading } = useHotelsData({ subRegionIds: sortedSubRegionId, enabled: shouldFetchHotel });
    const { loading: placeLoading } = usePlacesData({ subRegionIds: sortedSubRegionId, enabled: shouldFetchHotel });
    const { loading: activityLoading } = useActivitiesData({ subRegionIds: sortedSubRegionId, enabled: shouldFetchHotel });
    const { loading: roomTypeLoading } = useRoomTypesData({
        hotelId: activeHotelId,
        enabled: activeTab === 3 && !!activeHotelId,
    });

    // ─── handlers ────────────────────────────────────────────────────────────

    const getFilteredRegions = (excludeKeys) => {
        if (!regions) return [];
        const excluded = excludeKeys.map(k => formData.regionDetails[k]).filter(Boolean);
        return regions.filter(r => !excluded.includes(r._id));
    };

    const handleRegionChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            regionDetails: { ...prev.regionDetails, [field]: value },
        }));
    };

    const handleTripChange = (field, value) => {
        if(field === 'minSeats' && Number(formData?.tripDetails?.totalSeats) < Number(value)){
           toast.warn("Min seat can not be greater than total Seat")
           return ;
        }
        setFormData(prev => ({
            ...prev,
            tripDetails: { ...prev.tripDetails, [field]: value },
        }));
    };

    const handleItineraryChange = (dayIndex, fieldOrUpdates, value) => {
        setFormData(prev => {
            const iti = prev.itineraryBuilder;

            if (dayIndex === null) {
                // tripOverview top-level update
                return { ...prev, itineraryBuilder: { ...iti, [fieldOrUpdates]: value } };
            }

            // fieldOrUpdates can be a string (single field) or object (multiple fields)
            const patch = typeof fieldOrUpdates === 'object'
                ? fieldOrUpdates
                : { [fieldOrUpdates]: value };

            const updatedDays = iti.daysDetails.map((day, i) =>
                i === dayIndex ? { ...day, ...patch } : day
            );
            return { ...prev, itineraryBuilder: { ...iti, daysDetails: updatedDays } };
        });
    };

    const handleSaveRegion = () => {
        if (!region1 || !fromDate || !toDate) {
          toast.error('Please fill all Basic Details');
          return;
        }
      
        const from = new Date(fromDate);
        const to = new Date(toDate);
      
        if (to < from) {
          toast.error('To date cannot be earlier than From date');
          return;
        }
      
        setActiveTab(2);
      };

    const handleSaveVehicle = () => {
        const { assignedTo, totalSeats, minSeats, selectedVehicleId } = formData.tripDetails;
        if (!assignedTo || !totalSeats || !minSeats || !selectedVehicleId) {
            toast.error('Please fill all Trip Details');
            return;
        }
        setActiveTab(3);
    };
    const handleSaveItinerary = () => {
        const day1 = formData.itineraryBuilder?.daysDetails?.[0];
    
        if (!day1) {
            toast.error('Day 1 data is missing.');
            return;
        }
    
        // At least one sub-region
        const hasSubRegion = [day1.subRegion1, day1.subRegion2, day1.subRegion3].some(Boolean);
        if (!hasSubRegion) {
            toast.error('Day 1: Please select at least one Sub-Region.');
            return;
        }
    
        // Hotel — hotelId (inventory) or hotelName (manual)
        const hotel = day1?.hotelDetails;
        const hasHotel = hotel?.hotelType === 'manual'
            ? !!hotel?.hotelName?.trim()
            : !!hotel?.hotelId;
        if (!hasHotel) {
            toast.error('Day 1: Please select or enter a Hotel.');
            return;
        }
    
        // Room type — id (inventory) or typed string (manual)
        const hasRoomType = hotel?.hotelType === 'manual'
            ? !!hotel?.roomType?.trim()
            : !!hotel?.roomType;
        if (!hasRoomType) {
            toast.error('Day 1: Please select or enter a Room Type.');
            return;
        }
    
        // At least one meal
        const hasMeals = !!hotel?.meals?.trim();
        if (!hasMeals) {
            toast.error('Day 1: Please select at least one Meal (Breakfast, Lunch, or Dinner).');
            return;
        }
    
        // At least one place selected
        const hasPlace = day1.placeDetails?.length > 0;
        if (!hasPlace) {
            toast.error('Day 1: Please select at least one Place.');
            return;
        }
    
        const updatedDays = formData.itineraryBuilder.daysDetails.map(day => {
            const places = day.placeDetails ?? [];
            if (places.length === 0) return day;
    
            const hasFavourite = places.some(p => p.isFavourite);
            if (hasFavourite) return day; // already has a favourite, don't touch
    
            // No favourite set — mark the first place as favourite
            return {
                ...day,
                placeDetails: places.map((p, i) => ({
                    ...p,
                    isFavourite: i === 0,
                })),
            };
        });
    
        // Sync the auto-favourited days back into formData before saving
        setFormData(prev => ({
            ...prev,
            itineraryBuilder: {
                ...prev.itineraryBuilder,
                daysDetails: updatedDays,
            },
        }));
    
        console.log('Final formData:', { ...formData, itineraryBuilder: { ...formData.itineraryBuilder, daysDetails: updatedDays } });
        toast.success('Itinerary saved!');
    };
    // console.log("placesForActiveDay : ",placesForActiveDay)

    // ─── render ───────────────────────────────────────────────────────────────

    const tabs = ['Basic Details', 'Trip Details', 'Itinerary Builder'];

    const tabClick = (i)=>{
        if(i === 1){
            handleSaveRegion()
        }
        else if(i === 2){
            handleSaveVehicle()
        }
        else{
            setActiveTab(i+1)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: BLUE, margin: 0 }}>Create New Group Trip</h1>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Step {activeTab} of 3: {tabs[activeTab - 1]}</p>

            <button
                style={{ background: PINK, border: 'none', borderRadius: '6px', color: 'white', width: '30px', height: '30px', fontSize: '16px', cursor: 'pointer', marginTop: '8px', opacity: activeTab === 1 ? 0.4 : 1 }}
                onClick={() => activeTab > 1 && setActiveTab(p => p - 1)}
            >
                &#8592;
            </button>

            {/* Tab Bar */}
            <div style={{ display: 'flex', background: '#EEF0F5', borderRadius: '10px', padding: '4px', marginBottom: '8px' }}>
                {tabs.map((label, i) => (
                    <button
                        key={i}
                        onClick={() => tabClick(i)}
                        style={{
                            flex: 1, padding: '10px 16px', textAlign: 'center',
                            fontSize: '14px', fontWeight: activeTab === i + 1 ? '600' : '400',
                            cursor: 'pointer',
                            background: activeTab === i + 1 ? PINK : 'transparent',
                            border: 'none',
                            color: activeTab === i + 1 ? 'white' : '#666',
                            borderRadius: '8px', transition: 'all 0.2s ease',
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === 1 && (
                <RegionDetails
                    formData={formData.regionDetails}
                    regions={regions}
                    numDays={numDays}
                    handleChange={handleRegionChange}
                    handleSave={handleSaveRegion}
                    getFilteredRegions={getFilteredRegions}
                />
            )}

            {activeTab === 2 && (
                <TripDetails
                    formData={formData}
                    vehicleData={formData.tripDetails}
                    allVehicles={allVehicles}
                    vehicleLoading={vehicleLoading}
                    regions={regions}
                    numDays={numDays}
                    handleChange={handleTripChange}
                    handleSave={handleSaveVehicle}
                />
            )}

            {activeTab === 3 && (
                <ItineraryBuilder
                    formData={formData}
                    activeDay={activeDay}
                    setActiveDay={setActiveDay}
                    allSubRegions={allSubRegions}
                    hotelsForActiveDay={hotelsForActiveDay}
                    placesForActiveDay={placesForActiveDay}
                    activitiesForActiveDay={activitiesForActiveDay}
                    roomTypesForActiveDay={roomTypesForActiveDay}
                    subRegionLoading={subRegionLoading}
                    hotelLoading={hotelLoading}
                    placeLoading={placeLoading}
                    activityLoading={activityLoading}
                    roomTypeLoading={roomTypeLoading}
                    handleItineraryChange={handleItineraryChange}
                    handleSave={handleSaveItinerary}
                />
            )}
        </div>
    );
}

export default AddGroupTrip;






















// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import { useActivitiesData, useHotelsData, usePlacesData, useRegionsData, useRoomTypesData, useSubRegionsData, useVehiclesData } from '../../hooks/Resuable Hooks/useResuableData';
// import RegionDetails from './Add Group Trip/RegionDetails';
// import VehicleDetails from './Add Group Trip/VehicleDetails';

// const PINK = '#ED5F8D';
// const BLUE = '#18305C';

// function AddGroupTrip() {

//     const [activeTab, setActiveTab] = useState(1);
//     const [activeDay, setActiveDay] = useState(1)

//     const [formData, setFormData] = useState({
//         regionDetails: {
//             region1: '',
//             region2: '',
//             region3: '',
//             fromDate: '',
//             toDate: '',
//             noOfDays:''
//         },
//         vehicleDetails: {
//             assignedTo: '',
//             totalSeats: '',
//             minSeats: '',
//             perSeatPrice: '',  // Remove this
//             occupancy: {
//                 single: '',
//                 double: '',
//                 triple: '',
//             },
//             selectedVehicleId: '',
//             quantity: 1,
//         },
//         itineraryBuilder:{
//             tripOverview:'',
//             daysDetails:[
//                 {
//                     dayOverview:'',
//                     subRegion1:'69c90b2b2deef073dfdb14e8',
//                     subRegion2:'69c90b482deef073dfdb14ec',
//                     subRegion3:'',
//                     hotelDetails:{
//                         hotelsType:'inventory'||'manual',
//                         hotelId: '69c910e52deef073dfdb157b' ,// If from inventory,
//                         hotelName:"" , // Either form inventory or manual
//                         roomType:'',  // Double room , deluxe room family suite
//                         meals:'' // Lunch, Breakfast dinner
//                     },
//                     placeDetails:[
//                         {
//                             placeId:'',
//                             isFavourite :false
//                         }
//                     ],
//                     activities:[
//                         {
//                             activityType:'inventory'||'manual',
//                             activityId:'',// If from inventory
//                             activityName:'',
//                             isComplimentary:false,
//                             price:0  // isComplementary is true then price will be present otherwise null
//                         }
//                     ]
//                 }
//             ]
//         }
//     });

//     const { region1, region2, region3 } = formData.regionDetails;
//     const {subRegion1, subRegion2, subRegion3} = formData?.itineraryBuilder?.daysDetails?.[activeDay-1]
//     const selectedRegionIds = [region1, region2, region3].filter(Boolean);
//     const selectedSubRegionIds = [subRegion1, subRegion2, subRegion3].filter(Boolean);

//     function sortIdsConsistently(arr) {
//         return [...arr].sort((a, b) => a.localeCompare(b));
//     }

//     const sortedRegionId = sortIdsConsistently(selectedRegionIds);
//     const sortedSubRegionId = sortIdsConsistently(selectedSubRegionIds);

//     const { regions, loading: regionLoading } = useRegionsData();
//     const allSubRegions = useSelector((state) => state.subRegion.subRegionByRegionKey?.[sortedRegionId?.join(",")]);
//     const allVehicles = useSelector((state) => state.vehicle.vehiclesByRegionKey?.[sortedRegionId?.join(",")]);
//     const hotelsForActiveDay = useSelector((state)=>state.hotel.hotelsBysubRegionKey?.[sortedSubRegionId?.join(",")])
//     const placesForActiveDay = useSelector((state)=>state.place.placesBySubRegionKey?.[sortedSubRegionId?.join(",")])
//     const activitiesForActiveDay = useSelector((state)=>state.activity.activitiesBySubRegionKey?.[sortedSubRegionId?.join(",")])
//     const roomTypesForActiveDay = useSelector((state)=>state.room.roomTypesForHotelId?.[formData?.itineraryBuilder?.daysDetails?.[activeDay-1]?.hotelDetails?.hotelId])

//     const shouldFetchVehicle = activeTab === 2 && selectedRegionIds?.length > 0;
//     const { loading: vehicleLoading } = useVehiclesData({ regionIds: sortedRegionId, enabled: shouldFetchVehicle });

//     const shouldFetchSubRegion = activeTab === 3 && selectedRegionIds?.length > 0;
//     const { loading: subRegionLoading } = useSubRegionsData({ regionIds: sortedRegionId, enabled: shouldFetchSubRegion });

//     const shouldFetchHotel = activeTab === 3 && selectedSubRegionIds?.length > 0 ;

//     const { loading: hotelLoading } = useHotelsData({ subRegionIds: sortedSubRegionId, enabled: shouldFetchHotel });

//     const { loading: placeLoading } = usePlacesData({ subRegionIds: sortedSubRegionId, enabled: shouldFetchHotel });
//     const { loading: activityLoading } = useActivitiesData({ subRegionIds: sortedSubRegionId, enabled: shouldFetchHotel });

//     const shouldFetchRoomType = activeTab === 3 && formData?.itineraryBuilder?.daysDetails?.[activeDay-1]?.hotelDetails?.hotelId  ;
//     const { loading: roomTypeLoading } = useRoomTypesData({ hotelId:formData?.itineraryBuilder?.daysDetails?.[activeDay-1]?.hotelDetails?.hotelId , enabled: shouldFetchRoomType });


//     console.log("All SUb region which came to dropdown for active day : ",allSubRegions)
//     console.log("All Hotels which came to dropdown for active day : ",hotelsForActiveDay)
//     console.log("All Places which came to dropdown for active day : ",placesForActiveDay)
//     console.log("All Activities which came to dropdown for active day : ",activitiesForActiveDay)
//     console.log("All Room Type which came to dropdown for active day : ",roomTypesForActiveDay)

//     const { fromDate, toDate } = formData.regionDetails;
//     const numDays = (() => {
//         if (fromDate && toDate) {
//             const diff = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24);
//             return diff > 0 ? diff : '';
//         }
//         return '';
//     })();

//     const getFilteredRegions = (excludeKeys) => {
//         if (!regions) return [];
//         const excludedIds = excludeKeys.map((k) => formData.regionDetails[k]).filter(Boolean);
//         return regions.filter((r) => !excludedIds.includes(r._id));
//     };

//     const handleRegionChange = (field, value) => {
//         setFormData((prev) => ({
//             ...prev,
//             regionDetails: { ...prev.regionDetails, [field]: value },
//         }));
//     };

//     // Handles flat fields and nested occupancy object
//     const handleVehicleChange = (field, value) => {
//         setFormData((prev) => ({
//             ...prev,
//             vehicleDetails: { ...prev.vehicleDetails, [field]: value },
//         }));
//     };

//     const handleSaveRegion = () => {
//         const { region1, fromDate, toDate } = formData.regionDetails;
//         if (!region1 || !fromDate || !toDate) {
//             toast.error("Please fill all required fields");
//             return;
//         }
//         console.log("Region Data saved:", formData.regionDetails);
//         setActiveTab(2);
//     };

//     const handleSaveVehicle = () => {
//         const { assignedTo, totalSeats, minSeats, perSeatPrice, selectedVehicleId } = formData.vehicleDetails;
//         if (!assignedTo || !totalSeats || !minSeats || !perSeatPrice || !selectedVehicleId) {
//             toast.error("Please fill all required vehicle fields");
//             return;
//         }
//         console.log("Vehicle Data saved:", formData.vehicleDetails);
//         setActiveTab(3);
//     };

//     const tabs = ['Basic Details', 'Trip Details', 'Itinerary Builder'];

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
//             <h1 style={{ fontSize: '22px', fontWeight: '700', color: BLUE, margin: 0 }}>Create New Group Trip</h1>
//             <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Step {activeTab} of 3: {tabs[activeTab - 1]}</p>

//             {/* Back Button */}
//             <button
//                 style={{ background: PINK, border: 'none', borderRadius: '6px', color: 'white', width: '30px', height: '30px', fontSize: '16px', cursor: 'pointer', marginTop: '8px', opacity: activeTab === 1 ? 0.4 : 1 }}
//                 onClick={() => activeTab > 1 && setActiveTab(prev => prev - 1)}
//             >
//                 &#8592;
//             </button>

//             {/* Tab Bar */}
//             <div style={{ display: 'flex', background: '#EEF0F5', borderRadius: '10px', padding: '4px', marginBottom: '8px' }}>
//                 {tabs.map((label, i) => (
//                     <button
//                         key={i}
//                         onClick={() => setActiveTab(i + 1)}
//                         style={{
//                             flex: 1,
//                             padding: '10px 16px',
//                             textAlign: 'center',
//                             fontSize: '14px',
//                             fontWeight: activeTab === i + 1 ? '600' : '400',
//                             cursor: 'pointer',
//                             background: activeTab === i + 1 ? PINK : 'transparent',
//                             border: 'none',
//                             color: activeTab === i + 1 ? 'white' : '#666',
//                             borderRadius: '8px',
//                             transition: 'all 0.2s ease',
//                         }}
//                     >
//                         {label}
//                     </button>
//                 ))}
//             </div>

//             {activeTab === 1 && (
//                 <RegionDetails
//                     formData={formData.regionDetails}
//                     regions={regions}
//                     numDays={numDays}
//                     handleChange={handleRegionChange}
//                     handleSave={handleSaveRegion}
//                     getFilteredRegions={getFilteredRegions}
//                 />
//             )}

//             {activeTab === 2 && (
//                 <VehicleDetails
//                     formData={formData}
//                     vehicleData={formData.vehicleDetails}
//                     allVehicles={allVehicles}
//                     vehicleLoading={vehicleLoading}
//                     regions={regions}
//                     numDays={numDays}
//                     handleChange={handleVehicleChange}
//                     handleSave={handleSaveVehicle}
//                 />
//             )}

//             {activeTab === 3 && <div>Tab 3 Content</div>}
//         </div>
//     );
// }

// export default AddGroupTrip;
