import { apiDelete, apiGet, apiPost, apiPut } from "./api";

export const getStudents = (filters={}) => {
    const params = new URLSearchParams()

    if(filters.search) {
        params.append("search",filters.search)
    }

    if(filters.classId) {
        params.append("classId",filters.classId)
    }

    if(filters.active === true || filters.active === false) {
        params.append("active",String(filters.active))
    }

    const query = params.toString()

    return apiGet(query ? `/students?${query}` : "/students")
}

export const getStudentById = (studentId) => {
    return apiGet(`/students/${studentId}`)
}

export const getMyStudentProfile = () => {
    return apiGet("/students/me")
}

export const createStudent = (studentData) => {
    return apiPost("/students",studentData)
}

export const updateStudent = (studentId,studentData) => {
    return apiPut(`/students/${studentId}`,studentData)
}

export const deleteStudent = (studentId) => {
    return apiDelete(`/students/${studentId}`)
}