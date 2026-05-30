import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    useActivitiesData, useHotelsData, usePlacesData,
    usePlacesDataBySubRegionNames,
    useRegionsData, useRoomRatesData, useRoomTypesData, useSubRegionsData, useSuggestionGroupTripsData, useVehiclesData
} from '../../../hooks/Resuable Hooks/useResuableData';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react'
import ItineraryBuilderSampLePackage from './ItineraryBuilderSampLePackage';
import RegionDetailsSamplePackage from './RegionDetailsSamplePackage';
import GroupTripPolicies from '../../Group Trips/Add Group Trip/GroupTripPolicies';
import StepperTab from '../../Group Trips/Edit Group Trip/StepperTab';
import { blankDay } from './HotelDetailsSimplePackage';
import { isDayOneValid, isRegionDetailsValid } from './ValidationSimplePackage';
import { useSamplePackageHooks } from '../../../hooks/useSamplePackageHooks';

const PINK = '#ED5F8D';
const BLUE = '#18305C';


function sortIdsConsistently(arr) {
    if(!arr) return 
    return [...arr]?.sort((a, b) => a.localeCompare(b));
}

function AddSamplePackage() {

    const navigate = useNavigate()

    const {addSamplePackage} = useSamplePackageHooks()
    const [activeTab, setActiveTab] = useState(1);
    const [activeDay, setActiveDay] = useState(1);
    const [submitLoading, setSubmitLoading] = useState(false)
    const [selectedGroupTripDetails, setSelectedGroupTripDetails] = useState(null)
    const [suggestionPage, setSuggestionPage] = useState(true)


    const [formData, setFormData] = useState({
        regionDetails: {
            region1: null,
            region2: null,
            region3: null,
            startDate: '',
            noOfDays: 0,
            adults: 0,
            children: 0,
            childAges: [],
        },
        itineraryBuilder: {
            tripName: '',
            tripOverview: '',
            daysDetails: [],
        },
    });

    const [price, setPrice] = useState({
        totalPrice: 100,
        additionalPrice: 0,
        isGstChecked: false,
        gstPercent: 5,
        gstPrice: 0,
        finalPrice: 0
    })

    const [vendorDetails, setVendorDetails] = useState({
        vendorName: '',
        vendorPrice: 0,
        commission: 0
    })

    // console.log("Vendor details : ",vendorDetails)

    const handlePrice = (e) => {
        const { name, type, value, checked } = e.target;

        setPrice(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value)
        }));
    };

    const handleVendorDetails = (e) => {
        const { name, type, value } = e.target;

        setVendorDetails(prev => ({
            ...prev,
            [name]: type === 'text' ? value?.trim() : Number(value)
        }));
    };




    useEffect(() => {

        setPrice(prev => {
            let total = Number(prev.totalPrice) + Number(prev.additionalPrice)
            const isGstChecked = prev.isGstChecked;
            let gstValue = prev.gstPrice
            if (isGstChecked) {
                gstValue = (total * prev.gstPercent) / 100
                total += gstValue
            }
            return {
                ...prev,
                finalPrice: total,
                gstPrice: gstValue
            }
        })
    }, [price.additionalPrice, price?.totalPrice, price.isGstChecked, price.gstPercent])


    // Price Calculation 
    useEffect(() => {
        setPrice(prev => {
            let total = ((vendorDetails?.vendorPrice||0) + (vendorDetails?.commission||0)) || 0 ;

            const daysDetails = formData?.itineraryBuilder?.daysDetails || [];

            // Total hotel price of all days
            const hotelPrice = daysDetails.reduce((dayAcc, day) => {

                const rooms = day?.hotelDetails?.rooms || [];

                const totalRoomPrice = rooms.reduce((roomAcc, room) => {

                    const roomPrice = (room?.roomPrice || 0) * (room?.noOfRooms || 1);

                    const extraMattressPrice = (room?.extraMattressPrice || 0) * (room?.noOfExtraMattress || 0);

                    const cnbPrice = (room?.cnbPrice || 0) * (room?.noOfCnb || 0);

                    return (
                        roomAcc +
                        roomPrice +
                        extraMattressPrice +
                        cnbPrice
                    );
                }, 0);

                return dayAcc + totalRoomPrice;
            }, 0);

            const totalVehiclePrice = daysDetails.reduce((acc, day) => {
                const dayTotal = (day?.vehicleDetails ?? []).reduce(
                    (sum, v) => sum + ((v?.pricePerDay || 0) * (v?.quantity || 1)),
                    0
                );
                return acc + dayTotal;
            }, 0);

            const totalActivities = daysDetails.reduce((acc, day) => {
                const dayTotal = (day?.activities ?? []).reduce(
                    (sum, v) => sum + ((v?.price || 0) * (v?.quantity || 1)),
                    0
                );
                return acc + dayTotal;
            }, 0);


            total += hotelPrice + totalVehiclePrice + totalActivities

            return {
                ...prev,
                totalPrice: total
            };
        });
    }, [formData?.itineraryBuilder,vendorDetails?.vendorPrice,vendorDetails?.commission]);


    function addDays(days) {
        const date = new Date(formData?.regionDetails?.startDate || '2026-05-27');

        date.setDate(date.getDate() + days);

        return date.toISOString().split('T')[0];
    }


    // ─── computed ────────────────────────────────────────────────────────────

    const { region1, region2, region3, fromDate, toDate, noOfDays } = formData.regionDetails;
    const selectedRegionIds = [region1, region2, region3].filter(Boolean);
    const sortedRegionId = sortIdsConsistently(selectedRegionIds);


    // // When numDays changes, rebuild daysDetails array (preserve existing data)
    useEffect(() => {
        if (noOfDays > 0) {
            setFormData(prev => {
                const existing = prev.itineraryBuilder.daysDetails;
                const newDays = Array.from({ length: noOfDays }, (_, i) => existing[i] ?? blankDay());
                return {
                    ...prev,
                    itineraryBuilder: { ...prev.itineraryBuilder, daysDetails: newDays },
                };
            });
        }
    }, [noOfDays, region1, region2, region3]);

    // ─── active day sub-regions for fetching ─────────────────────────────────

    const activeDayData = formData.itineraryBuilder.daysDetails?.[activeDay - 1];
    const { subRegion1, subRegion2, subRegion3 } = activeDayData ?? {};
    const selectedSubRegionIds = [subRegion1, subRegion2, subRegion3].filter(Boolean);
    // ─── selectors ───────────────────────────────────────────────────────────

    const { regions, loading: regionLoading } = useRegionsData();
    const isProduction = useSelector((state) => state.user.isProduction)
    const allSubRegions = useSelector(s => s.subRegion.subRegionByRegionKey?.[sortedRegionId.join(',')]);
    const allVehicles = useSelector(s => s.vehicle.vehiclesByRegionKey?.[sortedRegionId.join(',')]);


    const sortedSubRegionId = sortIdsConsistently(selectedSubRegionIds);
    const selectedSubRegionNames = allSubRegions
    ?.filter(subregion => selectedSubRegionIds?.includes(subregion?._id))
    ?.map(subregion => subregion?.name);
    
    const sortedSubRegionNames = sortIdsConsistently(selectedSubRegionNames);

    // console.log("active day data : ", activeDayData)


    const keyForFindHotel = sortedSubRegionId.join(',') + activeDayData?.hotelDetails?.hotelCategory;
    // console.log("Key For find hotel : ",keyForFindHotel)
    const hotelsForActiveDay = useSelector(s => s.hotel.hotelsBysubRegionKey?.[sortedSubRegionId.join(',') + activeDayData?.hotelDetails?.hotelCategory]);
    // const placesForActiveDay = useSelector(s => s.place.placesBySubRegionKey?.[sortedSubRegionId.join(',')]);
    const placesForActiveDay = useSelector(s => s.place.placesBySubRegionNameKey?.[sortedSubRegionNames?.join(',')]);
    const activitiesForActiveDay = useSelector(s => s.activity.activitiesBySubRegionKey?.[sortedSubRegionId.join(',')]);
    const activeHotelId = activeDayData?.hotelDetails?.hotelId;
    const roomTypesForActiveDay = useSelector(s => s.room.roomTypesForHotelId?.[activeHotelId]);
    // const roomRatesForActiveDayHotel = useSelector(s => s.roomRate.roomRatesForHotelId?.[activeHotelId]);
    const hotelRates = useSelector(s => s.roomRate.roomRatesForHotelId?.[activeHotelId]) || [];
    function addDaysForRate(days) {
        const date = new Date(formData?.regionDetails?.startDate);

        date.setDate(date.getDate() + days);

        return date.toISOString().split('T')[0];
    }

    const roomRatesForActiveDayHotel = hotelRates?.find(rate => {
        const date = addDaysForRate(activeDay - 1)
        if (!date) return false
        const currentDate = new Date(date);
        const fromDate = new Date(rate.fromDate);
        const toDate = new Date(rate.toDate);

        return currentDate >= fromDate && currentDate <= toDate;
    });

    // console.log("roomTypesForActiveDay : ",roomTypesForActiveDay)
    // ─── conditional fetches ─────────────────────────────────────────────────

    const { loading: vehicleLoading } = useVehiclesData({
        regionIds: sortedRegionId,
        enabled: activeTab === 2 && selectedRegionIds.length > 0,
    });
    const { loading: subRegionLoading } = useSubRegionsData({
        regionIds: sortedRegionId,
        enabled: activeTab === 2 && selectedRegionIds.length > 0,
    });
    const shouldFetchHotel = activeTab === 2 && activeDayData?.hotelDetails?.hotelCategory && selectedSubRegionIds.length > 0;
    const shouldFetchMore = activeTab === 2 && selectedSubRegionIds.length > 0;
    const { loading: hotelLoading, refetch: refetchHotels } = useHotelsData({ subRegionIds: sortedSubRegionId, category: activeDayData?.hotelDetails?.hotelCategory, enabled: shouldFetchHotel });
    useEffect(() => {
        if (activeDayData?.hotelDetails?.hotelCategory) {
            refetchHotels()
        }
    }, [activeDayData?.hotelDetails?.hotelCategory])
    const { loading: placeLoading } = usePlacesDataBySubRegionNames({ subRegionNames: sortedSubRegionNames, enabled: shouldFetchMore });
    const { loading: activityLoading } = useActivitiesData({ subRegionIds: sortedSubRegionId, enabled: shouldFetchMore });
    const { loading: roomTypeLoading } = useRoomTypesData({
        hotelId: activeHotelId,
        enabled: activeTab === 2 && !!activeHotelId,
    });


    const shouldFetchRate = activeTab === 2 && formData?.regionDetails?.startDate && !!activeHotelId
    const { loading: roomRateLoading, refetch: refetchRoomRate } = useRoomRatesData({
        hotelId: activeHotelId,
        roomId: activeDayData?.hotelDetails?.roomTypeId,
        startDate: addDays(activeDay - 1),
        enabled: shouldFetchRate,
    });

    useEffect(() => {
        if (activeDayData?.hotelDetails?.hotelId) {
            refetchRoomRate()
        }
    }, [activeDayData?.hotelDetails?.hotelId])
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

    const handleSaveRegion = () => {
        tabClick(2)
    };


    const handleSaveItinerary = async () => {
        try {
            setSubmitLoading(true);
            const isRegionValid = isRegionDetailsValid(formData)
            if (!isRegionValid?.success) {
                toast.warn(isRegionValid.message || "Error")
                return;
            }
            const isDayValid = isDayOneValid(formData)
            // console.log("is Day valid : ",isDayValid)
            if (!isDayValid?.success) {
                toast.warn(isDayValid.message || "Error")
                return;
            }

            if(!formData?.itineraryBuilder?.tripName){
                return toast.warn("Give the trip Name")
            }

            const payload ={
                ...formData,
                vendorDetails,
                price
            }

            // console.log("submitted : ", payload?.itineraryBuilder?.daysDetails)

            const response = await addSamplePackage(payload)
            // console.log("Response : ",response)
            toast.success(response?.data?.message)
            navigate(-1)


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

    const tabs = ['Basic Details', 'Itinerary Builder', "Policies"];

    const tabClick = (i) => {
        if (i === 2) {
            if (!isRegionDetailsValid(formData)?.success) {
                toast.warn(isRegionDetailsValid(formData)?.message || "error")
                setActiveTab(i - 1)
            }
            else {
                setActiveTab(i)
            }
        }
        else {
            setActiveTab(i)
        }

    }

    // console.log("Fomr Data : ",formData)
    // console.log("Vehicles : ",allVehicles)



    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px', background: '#f5f6fa', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: BLUE, margin: 0 }}>Create New Sample Package</h1>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#18305C] -mt-1 transition-colors cursor-pointer"
            >
                <ArrowLeft size={15} />
                Back to List
            </button>
            <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Step {activeTab} of 3: {tabs[activeTab - 1]}</p>


            <StepperTab
                steps={tabs}
                activeStep={activeTab}
                onStepClick={tabClick}
            />

            {activeTab === 1 && (
                <RegionDetailsSamplePackage
                    formData={formData.regionDetails}
                    regions={regions}
                    handleChange={handleRegionChange}
                    handleSave={handleSaveRegion}
                    getFilteredRegions={getFilteredRegions}
                />
            )}

            {activeTab === 2 && (
                <ItineraryBuilderSampLePackage
                    formData={formData}
                    activeDay={activeDay}
                    setActiveDay={setActiveDay}
                    allSubRegions={allSubRegions}
                    allVehicles={allVehicles}
                    hotelsForActiveDay={hotelsForActiveDay}
                    placesForActiveDay={placesForActiveDay}
                    activitiesForActiveDay={activitiesForActiveDay}
                    roomTypesForActiveDay={roomTypesForActiveDay}
                    roomRatesForActiveDayHotel={roomRatesForActiveDayHotel}
                    subRegionLoading={subRegionLoading}
                    hotelLoading={hotelLoading}
                    placeLoading={placeLoading}
                    activityLoading={activityLoading}
                    roomTypeLoading={roomTypeLoading}
                    handleItineraryChange={handleItineraryChange}
                    handleSave={handleSaveItinerary}
                    submitLoading={submitLoading}
                    price={price}
                    handlePrice={handlePrice}
                    vendorDetails={vendorDetails}
                    handleVendorDetails={handleVendorDetails}
                />
            )}

            {activeTab === 3 && (
                <GroupTripPolicies regionId={region1} regionName={regions?.find(r => r?._id === region1)?.name} />
            )}
        </div>
    );
}

export default AddSamplePackage