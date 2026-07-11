export function calculateResult(subjects) {
  let obtained = 0;
  let total = 0;

  subjects.forEach((subject) => {
    obtained += Number(subject.marks || 0);
    total += Number(subject.maxMarks || 0);
  });

  const percentage = total === 0 ? 0 : (obtained / total) * 100;

  let grade = "F";

  if (percentage >= 90) {
    grade = "A+";
  } else if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B";
  } else if (percentage >= 60) {
    grade = "C";
  } else if (percentage >= 50) {
    grade = "D";
  }

  return {
    obtained,
    total,
    percentage: Number(percentage.toFixed(2)),
    grade,
    status: percentage >= 35 ? "PASS" : "FAIL",
  };
}
