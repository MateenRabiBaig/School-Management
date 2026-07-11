import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export const getTeachers = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.classId) {
    params.append("classId", filters.classId);
  }

  if (filters.subjectId) {
    params.append("subjectId", filters.subjectId);
  }

  if (filters.active === true || filters.active === false) {
    params.append("active", String(filters.active));
  }

  const query = params.toString();

  return apiGet(query ? `/teachers?${query}` : "/teachers");
};

export const getTeacherById = (teacherId) => {
  return apiGet(`/teachers/${teacherId}`);
};

export const getMyTeacherProfile = () => {
    return apiGet("/teachers/me");
  };

export const createTeacher = (teacherData) => {
  return apiPost("/teachers", teacherData);
};

export const updateTeacher = (teacherId, teacherData) => {
  return apiPut(`/teachers/${teacherId}`, teacherData);
};

export const deleteTeacher = (teacherId) => {
  return apiDelete(`/teachers/${teacherId}`);
};