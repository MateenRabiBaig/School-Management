import { apiPost } from "./api";
import { apiGet } from "./api";

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiPost("/upload", formData);
};

export const getTeacherDashboard = async => {
    apiGet("teacher-dashboard")
};

export const getTeacherStudents = () => apiGet("/teachers/students");

export const getTeacherClasses = () => apiGet("/teachers/classes");