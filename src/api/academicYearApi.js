import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./api";

export const getAcademicYears = () => apiGet("/academic-years");

export const createAcademicYear = (data) => apiPost("/academic-years", data);

export const updateAcademicYear = (id, data) => apiPut(`/academic-years/${id}`, data);

export const deleteAcademicYear = (id) => apiDelete(`/academic-years/${id}`);

export const activateAcademicYear = (id) =>
  apiPatch(`/academic-years/${id}/activate`, {});

export const getActiveAcademicYear = async () => {
  const response = await getAcademicYears();
  return (response.academicYears || []).find((academicYear) => academicYear.active) || null;
};
