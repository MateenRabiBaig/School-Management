import { apiDelete, apiGet, apiPost, apiPut } from"./api";

export const getAnnouncements = () => {
    return apiGet("/announcements");
};

export const createAnnouncement = data => {
    return apiPost("/announcements", data);
};

export const updateAnnouncement = (id,data) => {
    return apiPut(`/announcements/${id}`, data);
};

export const deleteAnnouncement = id => {
    return apiDelete(`/announcements/${id}`);
};