import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL;
export default axios.create({
    baseURL: BACKEND_URL
});

export const axiosSecure = axios.create({
    baseURL: BACKEND_URL,
    withCredentials:true
});