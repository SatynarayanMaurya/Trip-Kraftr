import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    useActivitiesData, useHotelsData, usePlacesData,
    useRegionsData, useRoomTypesData, useSubRegionsData, useSuggestionGroupTripsData, useVehiclesData
} from '../../hooks/Resuable Hooks/useResuableData';
import RegionDetails from './Add Group Trip/RegionDetails';
import TripDetails from './Add Group Trip/TripDetails';
import ItineraryBuilder from './Add Group Trip/ItineraryBuilder';
import { useGroupTripHooks } from '../../hooks/useGroupTripHooks';
import { useNavigate } from 'react-router-dom';
import { validateItinerary, ensureFavouritePlaces } from "./Add Group Trip/ValidateItinerary"

import { ArrowLeft } from 'lucide-react'
import SuggestionCardGroupCard from './Add Group Trip/SuggestionCardGroupCard';
import GroupTripPolicies from './Add Group Trip/GroupTripPolicies';
import StepperTab from './Edit Group Trip/StepperTab';

const PINK = '#ED5F8D';
const BLUE = '#18305C';

// ─── blank day template ───────────────────────────────────────────────────────
const blankDay = () => ({
    dayOverview: '',
    subRegion1: null,
    subRegion2: null,
    subRegion3: null,
    hotelDetails: {
        hotelType: 'inventory',
        hotelId: null,
        hotelName: '',
        roomTypeId: null,
        roomType: '',
        meals: '',
    },
    placeDetails: [],
    activities: [
        { activityType: 'inventory', activityId: null, activityName: '', isComplimentary: false, price: 0 }
    ],
});

function sortIdsConsistently(arr) {
    return [...arr].sort((a, b) => a.localeCompare(b));
}

function AddGroupTrip() {

    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState(1);
    const [activeDay, setActiveDay] = useState(1);
    const [submitLoading, setSubmitLoading] = useState(false)
    const [selectedGroupTripDetails, setSelectedGroupTripDetails] = useState(null)
    const [suggestionPage, setSuggestionPage] = useState(true)

    const { addGroupTrip } = useGroupTripHooks()

    const [formData, setFormData] = useState({
        regionDetails: {
            region1: null,
            region2: null,
            region3: null,
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

    useEffect(() => {
        if (selectedGroupTripDetails) {

            setFormData((prev) => ({
                ...prev,
                itineraryBuilder: selectedGroupTripDetails?.itineraryBuilder,
            }));
        }
    }, [selectedGroupTripDetails]);

    // ─── computed ────────────────────────────────────────────────────────────

    const { region1, region2, region3, fromDate, toDate, noOfDays } = formData.regionDetails;
    const selectedRegionIds = [region1, region2, region3].filter(Boolean);
    const sortedRegionId = sortIdsConsistently(selectedRegionIds);

    const numDays = (() => {
        if (fromDate && toDate) {
            const diff = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24);
            return diff > 0 ? Math.round(diff) + 1 : 0;
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
    }, [numDays, region1, region2, region3]);

    // ─── active day sub-regions for fetching ─────────────────────────────────

    const activeDayData = formData.itineraryBuilder.daysDetails?.[activeDay - 1];
    const { subRegion1, subRegion2, subRegion3 } = activeDayData ?? {};
    const selectedSubRegionIds = [subRegion1, subRegion2, subRegion3].filter(Boolean);
    const sortedSubRegionId = sortIdsConsistently(selectedSubRegionIds);

    // ─── selectors ───────────────────────────────────────────────────────────

    const { regions, loading: regionLoading } = useRegionsData();
    const isProduction = useSelector((state) => state.user.isProduction)
    const allSubRegions = useSelector(s => s.subRegion.subRegionByRegionKey?.[sortedRegionId.join(',')]);
    const allVehicles = useSelector(s => s.vehicle.vehiclesByRegionKey?.[sortedRegionId.join(',')]);
    const hotelsForActiveDay = useSelector(s => s.hotel.hotelsBysubRegionKey?.[sortedSubRegionId.join(',')]);
    const placesForActiveDay = useSelector(s => s.place.placesBySubRegionKey?.[sortedSubRegionId.join(',')]);
    const activitiesForActiveDay = useSelector(s => s.activity.activitiesBySubRegionKey?.[sortedSubRegionId.join(',')]);
    const activeHotelId = activeDayData?.hotelDetails?.hotelId;
    const roomTypesForActiveDay = useSelector(s => s.room.roomTypesForHotelId?.[activeHotelId]);
    const suggestionGroupTrips = useSelector(s => s.groupTrip.suggestionGroupTripsSlice?.[`${region1},${region2},${region3},${noOfDays}`])

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
    const { loading: suggestionGroupTripLoading } = useSuggestionGroupTripsData({
        region1, region2, region3, noOfDays,
        enabled: activeTab === 3 && !!region1 && suggestionPage,
    });

    // ─── handlers ────────────────────────────────────────────────────────────

    const getFilteredRegions = (excludeKeys) => {
        if (!regions) return [];
        const excluded = excludeKeys.map(k => formData.regionDetails[k]).filter(Boolean);
        return regions.filter(r => !excluded.includes(r._id));
    };

    const handleRegionChange = (field, value) => {
        if (!value) {
            value = null
        }
        setFormData(prev => ({
            ...prev,
            regionDetails: { ...prev.regionDetails, [field]: value },
        }));
    };

    const handleTripChange = (field, value) => {
        if (field === 'minSeats' && Number(formData?.tripDetails?.totalSeats) < Number(value)) {
            toast.warn("Min seat can not be greater than total Seat")
            return;
        }
        setFormData(prev => ({
            ...prev,
            tripDetails: { ...prev.tripDetails, [field]: value },
        }));
    };

    const handleItineraryChange = (dayIndex, fieldOrUpdates, value) => {
        // console.log("value : ",value)
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

    const handleSaveRegion = (isSave=true) => {
        if (!region1 || !fromDate || !toDate) {
            toast.error('Please fill all Basic Details');
            return false;
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);

        if (to < from) {
            toast.error('To date cannot be earlier than From date');
            return false;
        }
        if(isSave){
            setActiveTab(2);
        }
        else{
            return true;
        } 

    };

    const handleSaveVehicle = (isSave=true) => {
        const { assignedTo, totalSeats, minSeats, selectedVehicleId } = formData.tripDetails;
        if (!assignedTo || !totalSeats || !minSeats || !selectedVehicleId) {
            toast.error('Please fill all Trip Details');
            return;
        }
        setActiveTab(3);
    };

    const handleSaveItinerary = async () => {
        try {
            setSubmitLoading(true);

            // ✅ Validation
            const { isValid, message } = validateItinerary(formData);
            if (!isValid) {
                toast.error(message);
                return;
            }

            // ✅ Ensure favourite places
            const updatedDays = ensureFavouritePlaces(
                formData.itineraryBuilder.daysDetails
            );

            const updatedFormData = {
                ...formData,
                itineraryBuilder: {
                    ...formData.itineraryBuilder,
                    daysDetails: updatedDays,
                },
            };

            setFormData(updatedFormData);

            // ✅ API call
            const response = await addGroupTrip(updatedFormData);

            toast.success(response?.data?.message || 'Itinerary saved!');
            navigate(-1);

        } catch (error) {
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Error in adding the admin"
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    const tabs = ['Basic Details', 'Trip Details', 'Itinerary Builder', "Policies"];

    const tabClick = (i) => {
        // console.log("i : ",i)
        // if (i === 1) {
        //     handleSaveRegion(false)
        // }
        // else if (i === 2) {
        //     handleSaveVehicle(false)
        // }
        // else {
        //     handleSaveRegion(true)
        //     // setActiveTab(i)
        // }
        // // else{
        // //     setActiveTab(i)
        // // }
        if(i===1){
            setActiveTab(i)
            return;
        }
        const isValidJump = handleSaveRegion(false)
        if(isValidJump && i!==1){
            setActiveTab(i)
        }
        else{
            setActiveTab(1)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: BLUE, margin: 0 }}>Create New Group Trip</h1>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#18305C] -mt-1 transition-colors cursor-pointer"
            >
                <ArrowLeft size={15} />
                Back to List
            </button>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Step {activeTab} of 4: {tabs[activeTab - 1]}</p>


            <StepperTab
                steps={tabs}
                activeStep={activeTab}
                onStepClick={tabClick}
            />

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

            {
                activeTab === 3 &&
                <p onClick={() => setSuggestionPage(true)} className='flex justify-end'>Show Suggestiton</p>
            }

            {activeTab === 3 && (
                suggestionPage ?
                    <SuggestionCardGroupCard data={suggestionGroupTrips} closeSuggestion={() => setSuggestionPage(false)} setSelectedGroupTripDetails={(val) => setSelectedGroupTripDetails(val)} /> :
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
                        submitLoading={submitLoading}
                    />
            )}

            {activeTab === 4 && (
                <GroupTripPolicies regionId={region1} regionName={regions?.find(r => r?._id === region1)?.name} />
            )}
        </div>
    );
}

export default AddGroupTrip;

