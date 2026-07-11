import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export const markAttendance = (data) => apiPost("/attendance", data);

export const getAttendance = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.date) {
    params.append("date", filters.date);
  }

  if (filters.classId) {
    params.append("classId", filters.classId);
  }

  if (filters.studentId) {
    params.append("studentId", filters.studentId);
  }

  if (filters.status) {
    params.append("status", filters.status);
  }

  const query = params.toString();

  return apiGet(query ? `/attendance?${query}` : "/attendance");
};

export const getTodayAttendance = () => apiGet("/attendance/today");

export const getStudentAttendance = (studentId) => apiGet(`/attendance/student/${studentId}`);

export const updateAttendance = (id, data) => apiPut(`/attendance/${id}`, data);

export const deleteAttendance = (id) => apiDelete(`/attendance/${id}`);
