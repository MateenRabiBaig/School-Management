const { Classes, Subjects } = require("../config/academicData")

const getClassById = (classId) => {
    return Classes.find((classItem) => classItem.id === Number(classId))
}

const getSubjectById = (subjectId) => {
    return Subjects.find((subject) => subject.id === Number(subjectId))
}

const validateStudentAcademicData = (classId,selectedSubjects = []) => {
    const classItem = getClassById(classId)
    
    if(!classItem) {
        return { valid: false, message: "Invalid class selected" }
    }

    if(!Array.isArray(selectedSubjects)) {
        return { valid: false, message: "Selected subjects must be an array" }
    }

    const normalizedSelectedSubjects = selectedSubjects.map(Number)
    const uniqueSubjects = [...new Set(normalizedSelectedSubjects)]

    if(uniqueSubjects.length!==normalizedSelectedSubjects.length) {
        return { valid: false, message: "Duplicate selected subjects are not allowed" }
    }

    for(const subjectId of uniqueSubjects) {
        if(!getSubjectById(subjectId)) {
            return { valid: false, message: `Subject ${subjectId} does not exist` }
        }
    }

    const optionalSubjects = classItem.optionalSubjects || []
    const allowedOptionalSubjectIds = optionalSubjects.flatMap((group) => group.subjects)
    const invalidSubject = uniqueSubjects.find((subjectId) => !allowedOptionalSubjectIds.includes(subjectId))

    if(invalidSubject) {
        return { valid: false, message: "Selected subject is not available for this class" }
    }

    for(const group of optionalSubjects) {
        const selectedFromGroup = uniqueSubjects.filter((subjectId) => group.subjects.includes(subjectId))
        
        if(selectedFromGroup.length!==1) {
            return { valid: false, message: `${group.groupName}: exactly one subject must be selected` }
        }
    }

    return { valid: true, classItem, selectedSubjects: uniqueSubjects }
}

const getStudentSubjectIds = (student) => {
    const classItem = getClassById(student.classId)
    
    if(!classItem) {
        return []
    }
    
    return [...classItem.compulsorySubjects,...(student.selectedSubjects || [])]
}

module.exports = { getClassById, getSubjectById, validateStudentAcademicData, getStudentSubjectIds }