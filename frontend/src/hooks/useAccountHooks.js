
import { apiConnector } from '../services/apiConnector'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../redux/slices/userSlice'
import { accountsEndpoints } from '../services/Apis/accountsApis';
import { addNewB2BAccount, addNewB2CAccount, setB2BAccountById, setB2BAccountsByPage, setB2CAccountById, setB2CAccountsByPage } from '../redux/slices/accountSlice';

export const useAccountHooks = () => {
    const dispatch = useDispatch();
    const b2bAccountsByPage = useSelector(s=>s.account.b2bAccountsByPage)
    const b2cAccountsByPage = useSelector(s=>s.account.b2cAccountsByPage)
    const b2bAccountsByIds = useSelector(s=>s.account.b2bAccountsByIds)
    const b2cAccountsByIds = useSelector(s=>s.account.b2cAccountsByIds)

    const addB2BAccount = async (details) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", accountsEndpoints.ADD_B2B_ACCOUNT, details)
            if(response?.data?.success){
                dispatch(addNewB2BAccount(response?.data?.newAccount))
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const addB2CAccount = async (details) => {  // For Normal Org_admin
        try {
            dispatch(setLoading(true));
            const response = await apiConnector("POST", accountsEndpoints.ADD_B2C_ACCOUNT, details)
            if(response?.data?.success){
                dispatch(addNewB2CAccount(response?.data?.newAccount))
            }
            return response;
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    // For getting accounts with paginated
    const getb2bAccounts = async (page = 1, limit = 5) => {
        try {
            const cachedPage = b2bAccountsByPage?.[page]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${accountsEndpoints.GET_B2B_ACCOUNTS}?page=${page}&limit=${limit}`
            )
            if(response?.data?.success){
                dispatch(
                    setB2BAccountsByPage({
                        page,
                        data: response?.data?.allB2BAccounts,
                        pagination: response?.data?.pagination,
                    })
                )
            }

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    // For getting accounts with paginated
    const getb2cAccounts = async (page = 1, limit = 5) => {
        try {
            const cachedPage = b2cAccountsByPage?.[page]

            if (cachedPage) return cachedPage   // 🚀 return cached data

            dispatch(setLoading(true))

            const response = await apiConnector(
                "GET",
                `${accountsEndpoints.GET_B2C_ACCOUNTS}?page=${page}&limit=${limit}`
            )
            if(response?.data?.success){
                dispatch(
                    setB2CAccountsByPage({
                        page,
                        data: response?.data?.allB2CAccounts,
                        pagination: response?.data?.pagination,
                    })
                )
            }

            return response

        } catch (error) {
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    // For getting accounts with paginated
    const getB2BAccountById = async (accountId) => {
        try {
          const cachedPage = b2bAccountsByIds?.[accountId]
    
          if (cachedPage) return cachedPage
          dispatch(setLoading(true))
    
          const response = await apiConnector(
            "GET",
            `${accountsEndpoints.GET_B2B_ACCOUNT_BY_ID}/${accountId}`
          )

          if(response?.data?.success){
                dispatch(setB2BAccountById({ _id: accountId, data: response?.data?.foundAccount }))

          }
    
    
          return response
    
        } catch (error) {
          throw error
        } finally {
          dispatch(setLoading(false))
        }
      }
    // For getting accounts with paginated
    const getB2CAccountById = async (accountId) => {
        try {
          const cachedPage = b2cAccountsByIds?.[accountId]
    
          if (cachedPage) return cachedPage
          dispatch(setLoading(true))
    
          const response = await apiConnector(
            "GET",
            `${accountsEndpoints.GET_B2C_ACCOUNT_BY_ID}/${accountId}`
          )

          if(response?.data?.success){
                dispatch(setB2CAccountById({ _id: accountId, data: response?.data?.foundAccount }))

          }
    
    
          return response
    
        } catch (error) {
          throw error
        } finally {
          dispatch(setLoading(false))
        }
      }



    return {
        addB2BAccount,
        addB2CAccount,
        getb2bAccounts,
        getb2cAccounts,
        getB2BAccountById,
        getB2CAccountById
    };
};