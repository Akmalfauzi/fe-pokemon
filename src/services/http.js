import axios from 'axios'

// Get base URL from env
const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000'

// Create axios instance
export const http = axios.create({
    baseURL: `${baseURL}`,
    // timeout: 15000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
})

// Response interceptor for error handling
http.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        const message = error?.response?.data?.message || error.message || 'Request failed'

        console.error('API Error:', { status, message, error })

        return Promise.reject({
            status,
            message,
            raw: error
        })
    }
)

export async function httpGet(url, config = {}) {
    const { data } = await http.get(url, config)
    return data
}
