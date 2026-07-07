
import { apiConnector } from '../services/apiConnector'
import { useDispatch } from 'react-redux'
import { mailEndpoints } from '../services/Apis/mailApis';

export const useMailHooks = () => {
    
    const dispatch = useDispatch();

    const sendMail = async(from,to,subject,body)=>{
      try {
        const response = await apiConnector("POST",mailEndpoints.SENd_MAIL,{from:from,to:to,subject:subject,body:body} )
        return response; 
      } catch (error) {
        throw error;
      }
    }
  
    return { sendMail };
  };