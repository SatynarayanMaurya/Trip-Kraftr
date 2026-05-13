import React, { useEffect, useState } from 'react'
import { useEnquiryHooks } from '../../../hooks/useEnquiryHooks'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useCommonHooks } from '../../../hooks/useCommonHooks'

function AddParticipant({ closeModal }) {

    const {searchB2BEnquiry} = useCommonHooks()
    const isProduction = useSelector(s=>s.user.isProduction)
    const [search, setSearch] = useState('')
    const [fetchLoading, setFetchLoading] = useState(false)
    const [searchedEnquiries, setSearchedEnquiries] = useState(null)


    // The source is working as statsu filter
    const searchEnquiry = async () => {
        try {
            setFetchLoading(true)
            const response = await searchB2BEnquiry('r','New', true);
            console.log("response : ",response)
            setSearchedEnquiries(response?.data?.searchedEnquiries)
        }
        catch (error) {
            if (!isProduction) {
                console.log("========= ERROR DEBUG START =========");
                console.log("Error:", error);
                console.log("Response:", error?.response);
                console.log("========= ERROR DEBUG END =========");
            }
            toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }
        finally {
            setFetchLoading(false)
        }
    }

    useEffect(() => {
        // if (search?.trim() ) {
            searchEnquiry()
        // }
    }, [search])
    return (
        <div onClick={closeModal} className='fixed inset-0 z-1000 bg-red-800 flex justify-center items-center'>
            <div onClick={(e) => e.stopPropagation()} className='w-[50%] h-[30%] bg-white'>
                <form action="">
                    <input type="text" />
                </form>
            </div>
        </div>
    )
}

export default AddParticipant