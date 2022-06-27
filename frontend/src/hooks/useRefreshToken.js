import { useContext  } from "react";
import AuthContext from "../store/auth-context";
import axios from "../api/axios";



const useRefreshToken = () => {

    const authctx = useContext(AuthContext)

    const refresh = async() => {
        const res = await axios.get('/api/refresh', {
            withCredentials: true
        });
        //Change current state of user
        // console.log("AT", res.data.accessToken)
        authctx.setToken(res.data.accessToken)

        return res.data.accessToken;

    }
    return refresh;
}

export default useRefreshToken