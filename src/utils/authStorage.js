const TOKEN_KEY = "token"
const USER_KEY = "user"

export const saveAuth = (token,user) => {
    localStorage.setItem(TOKEN_KEY,token)
    localStorage.setItem(USER_KEY,JSON.stringify(user))
}

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

export const getStoredUser = () => {
    const user = localStorage.getItem(USER_KEY)

    if(!user) {
        return null
    }

    try {
        return JSON.parse(user)
    }
    catch {
        clearAuth()
        return null
    }
}

export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem("role")
    localStorage.removeItem("adminId")
    localStorage.removeItem("teacherId")
    localStorage.removeItem("studentId")
}

export const isAuthenticated = () => {
    return Boolean(getToken())
}