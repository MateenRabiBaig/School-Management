import { apiDelete, apiGet, apiPost } from "./api";

export const saveMarks = (data) => apiPost("/marks", data);

export const getMarks = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.studentId) {
    params.append("studentId", filters.studentId);
  }

  if (filters.examType) {
    params.append("examType", filters.examType);
  }

  if (filters.classId) {
    params.append("classId", filters.classId);
  }

  if (filters.academicYear) {
    params.append("academicYear", filters.academicYear);
  }

  const query = params.toString();

  return apiGet(query ? `/marks?${query}` : "/marks");
};

export const getStudentMarks = (id) => apiGet(`/marks/student/${id}`);

export const getMarksById = (id) => apiGet(`/marks/${id}`);

export const deleteMarks = (id) => apiDelete(`/marks/${id}`);
