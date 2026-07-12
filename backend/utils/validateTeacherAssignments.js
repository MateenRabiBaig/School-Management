const { Classes, Subjects } = require("../config/academicData");

const CLASS_IDS = Classes.map((classItem) => classItem.id);
const SUBJECT_IDS = Subjects.map((subject) => subject.id);

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