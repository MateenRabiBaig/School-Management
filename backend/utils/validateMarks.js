const EXAM_TYPES = ["Test 1", "Test 2", "Test 3", "Midterm", "Final"];

const validateMarks = ({ examType, subjects }) => {
  if (!EXAM_TYPES.includes(examType)) {
    return { valid: false, message: "Invalid exam type" }
  }

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return { valid: false, message: "At least one subject is required" }
  }

  const seenSubjects = new Set();
  
  for (const subject of subjects) {
        if (typeof subject.subjectId !== "number") {
            return { valid: false, message: "Invalid subject" }
        }

        if (seenSubjects.has(subject.subjectId)) {
            return { valid: false, message: "Duplicate subject found" }
        }

        seenSubjects.add(subject.subjectId);

        if (typeof subject.maxMarks !== "number" || subject.maxMarks <= 0) {
            return { valid:false, message:"Invalid maximum marks" }
        }

        if(subject.marks > subject.maxMarks) {
            return { valid:false, message:"Marks cannot exceed maximum marks" }
        }
    }

  return { valid: true }
};

module.exports = validateMarks