import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEnquiryHooks } from '../../../hooks/useEnquiryHooks';
import { useCommonHooks } from '../../../hooks/useCommonHooks';

function AddEnquiryB2B() {


  const isProduction = useSelector(s=>s.user.isProduction)
  const [fetchLoading, setFetchLoading] = useState(false)
  const {searchB2BAccountsForEnquiry} = useCommonHooks()
  const [searchInput, setSearchInput] = useState('a')
  const [searchedAccounts, setSearchedAccounts] = useState([])

  console.log("Searched Accounts : ",searchedAccounts)

  const suggestionAccounts = async()=>{
    try{
      setFetchLoading(true)
      const response = await searchB2BAccountsForEnquiry (searchInput)
      // console.log("response : ",response?.data?.searchedAccounts)
      setSearchedAccounts(response?.data?.searchedAccounts||[])
    }
    catch(error){
      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========");
        console.log("Error:", error);
        console.log("Response:", error?.response);
        console.log("========= ERROR DEBUG END =========");
      }
      toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
    }
    finally{
      setFetchLoading(false)
    }
  }

  useEffect(()=>{
    if(searchInput)  suggestionAccounts()
  },[searchInput])

  return (
    <div>AddEnquiryB2B</div>
  )
}

export default AddEnquiryB2B