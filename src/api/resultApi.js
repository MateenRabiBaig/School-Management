import { apiGet } from "./api";

export const getResults=(filters={})=>{
    const params=new URLSearchParams();
    
    if(filters.classId)
        params.append("classId", filters.classId);
    
    if(filters.examType)
        params.append("examType", filters.examType);
    
    if(filters.academicYear)
        params.append("academicYear", filters.academicYear);
    
    const query=params.toString();
    return apiGet(query ?`/results?${query}` :"/results");
}

export const getStudentResults = (id) => apiGet(`/results/student/${id}`);
export const getStudentReportCard = (id) => apiGet(`/results/student/${id}`);
export const getResultById = (id) => apiGet(`/results/${id}`);