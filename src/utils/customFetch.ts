import axios from "axios";

const customFetch = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api",
})

customFetch.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default customFetch;