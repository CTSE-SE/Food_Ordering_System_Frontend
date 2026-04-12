import axios from "axios";

const customFetch = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api",
})

export default customFetch