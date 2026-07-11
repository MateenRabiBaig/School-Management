const CLASS_IDS = [10, 11, 12];
const SUBJECT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const validateTeacherAssignments = ({ assignedClasses, assignedSubjects }) => {
  if (!Array.isArray(assignedClasses)) {
    return { valid: false, message: "Assigned classes must be an array" };
  }

  if (!Array.isArray(assignedSubjects)) {
    return { valid: false, message: "Assigned subjects must be an array" };
  }

  const classIds = assignedClasses.map(Number);
  const subjectIds = assignedSubjects.map(Number);

  const invalidClass = classIds.find((classId) => !CLASS_IDS.includes(classId));

  if (invalidClass !== undefined) {
    return { valid: false, message: `Invalid class ID: ${invalidClass}` };
  }

  const invalidSubject = subjectIds.find((subjectId) => !SUBJECT_IDS.includes(subjectId));

  if (invalidSubject !== undefined) {
    return { valid: false, message: `Invalid subject ID: ${invalidSubject}` };
  }

  return { valid: true, assignedClasses: [...new Set(classIds)], assignedSubjects: [...new Set(subjectIds)] };
};

module.exports = validateTeacherAssignments;