import { apiPost } from "./api";

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiPost("/upload", formData);
};