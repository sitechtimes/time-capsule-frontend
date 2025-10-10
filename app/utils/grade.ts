export function getStudentGrade(graduationYear: number): number | string {
  const currentYear = new Date().getFullYear();
  const grade = 12 - (graduationYear - currentYear);
  if (grade < 1) {
    return "Student has not started school yet";
  } else if (grade > 12) {
    return "Student has already graduated";
  }
  return grade;
}