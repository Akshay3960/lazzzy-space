import { axiosSecure } from "../api/axios";
import { useEffect, useContext } from "react";
import useRefreshToken from "../hooks/useRefreshToken"
import AuthContext from "../store/auth-context";

//USAGE: https://lightrains.com/blogs/axios-intercepetors-react/#:~:text=Share%20Axios%20Interceptors%20with%20React,response%20that%20is%20being%20received.

const useAxiosSecure = () => {

    const authCtx = useContext(AuthContext)
    const refresh = useRefreshToken()

    useEffect(()=>{

        const requestIntercept = axiosSecure.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authCtx.accessToken}`;
                }
                return config;
            }, (err) => Promise.reject(err)
        )
        const responseIntercept = axiosSecure.interceptors.response.use(
            response => response, // if response is 200
            async(err) => { // if there is some error
                const sentRequest = err?.config;
                if(err?.response?.status===403 && !sentRequest?.sent) {
                    sentRequest.sent = true;
                    const newAccessToken = await refresh()
                    sentRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosSecure(sentRequest)
                }
                return Promise.reject(err)
            }
        )
    
        return () => {
            axiosSecure.interceptors.response.eject(responseIntercept)
            axiosSecure.interceptors.request.eject(requestIntercept)
        }
    },[authCtx, refresh])
    return axiosSecure
}

export default useAxiosSecure