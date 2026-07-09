const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const getToken = () => {
    return localStorage.getItem("token")
}

const clearStoredAuth = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("adminId")
    localStorage.removeItem("teacherId")
    localStorage.removeItem("studentId")
}

const apiRequest = async(endpoint,options={}) => {
    const token = getToken()
    const headers = {...options.headers}

    if(!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json"
    }

    if(token) {
        headers.Authorization = `Bearer ${token}`
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`,{...options,headers})
        const contentType = response.headers.get("content-type")
        let data = null
        
        if(contentType && contentType.includes("application/json")) {
            data = await response.json()
        }

        if(!response.ok) {
            const error = new Error(data?.message || "Something went wrong")
            error.status = response.status
            throw error
        }
        return data
    }
    catch(error) {
        if(error instanceof TypeError && error.message === "Failed to fetch") {
            throw new Error("Unable to connect to server")
        }
        throw error
    }
}

export const apiGet = (endpoint) => {
    return apiRequest(endpoint)
}

export const apiPost = (endpoint,body) => {
    return apiRequest(endpoint,{
        method: "POST",
        body: body instanceof FormData ? body : JSON.stringify(body)
    })
}

export const apiPut = (endpoint,body) => {
    return apiRequest(endpoint,{
        method: "PUT",
        body: body instanceof FormData ? body : JSON.stringify(body)
    })
}

export const apiDelete = (endpoint) => {
    return apiRequest(endpoint,{
        method: "DELETE",
    })
}

export default apiRequest