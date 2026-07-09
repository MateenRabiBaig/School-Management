import { apiGet, apiPost } from "./api";

export const loginUser = (creadentials) => {
    return apiPost("/auth/login",creadentials)
}

export const getCurrentUser = () => {
    return apiGet("/auth/me")
}