import { Subjects } from "../data/data";

export function prepareReportCard({ student, attendancePercentage, result }) {
  const obtained = result.obtained;
  const total = result.total;
  const percentage = result.percentage;
  const grade = result.grade;
  const status = result.status;

  return {
    schoolName: "ABC Public School",
    student,
    examType: result.examType,
    academicYear: result.academicYear,
    subjects: (result.subjects || []).map((subject) => ({
      ...subject,
      subjectName:
        Subjects.find((item) => item.id === subject.subjectId)?.name || "Unknown",
    })),
    obtained,
    total,
    percentage,
    grade,
    status,
    attendancePercentage,
  };
}
