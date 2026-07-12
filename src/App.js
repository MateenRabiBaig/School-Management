import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentList from "./pages/admin/students/StudentList";
import AddStudent from "./pages/admin/students/AddStudent";
import StudentProfile from "./pages/admin/students/StudentProfile";
import MarkAttendance from "./pages/admin/attendance/MarkAttendance";
import AttendanceRecords from "./pages/admin/attendance/AttendanceRecords";
import AddMarks from "./pages/admin/marks/AddMarks";
import MarksList from "./pages/admin/marks/MarksList";
import MarksDetails from "./pages/admin/marks/MarksDetails";
import AdminResults from "./pages/admin/results/AdminResults";
import MySubjects from "./pages/student/MySubjects";
import MyAttendance from "./pages/student/MyAttendance";
import MyResults from "./pages/student/MyResults";
import MyProfile from "./pages/student/MyProfile";
import ReportCards from "./pages/admin/ReportCards";
import ReportCardDetails from "./pages/admin/ReportCardDetails";
import MyReportCard from "./pages/student/MyReportCard";
import Announcements from "./pages/admin/Announcements";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import AcademicYears from "./pages/admin/academic-years/AcademicYears";
import TeacherList from "./pages/admin/teachers/TeacherList";
import AddTeacher from "./pages/admin/teachers/AddTeacher";
import AdminTeacherProfile from "./pages/admin/teachers/TeacherProfile";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherMarks from "./pages/teacher/TeacherMarks";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherAnnouncements from "./pages/teacher/TeacherAnnouncements";
import AdminReportCard from "./pages/admin/results/AdminReportCard";

function App() {
  const adminRoute = (element) => (
    <ProtectedRoute allowedRoles={["admin"]}>
      {element}
    </ProtectedRoute>
  );

  const studentRoute = (element) => (
    <ProtectedRoute allowedRoles={["student"]}>
      {element}
    </ProtectedRoute>
  );

  const teacherRoute = (element) => (
    <ProtectedRoute allowedRoles={["teacher"]}>
      {element}
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={adminRoute( <AdminDashboard /> )} />
        <Route path="/admin/home" element={adminRoute( <AdminDashboard /> )} />
        <Route path="/admin/students" element={adminRoute( <StudentList /> )} />
        <Route path="/admin/students/add" element={adminRoute( <AddStudent /> )} />
        <Route path="/admin/students/:id" element={adminRoute( <StudentProfile /> )} />
        <Route path="/admin/attendance" element={adminRoute( <MarkAttendance /> )} />
        <Route path="/admin/attendance/records" element={adminRoute( <AttendanceRecords /> )} />
        <Route path="/admin/marks" element={adminRoute( <AddMarks /> )} />
        <Route path="/admin/marks/list" element={adminRoute( <MarksList /> )} />
        <Route path="/admin/marks/details/:studentId/:subjectId" element={adminRoute( <MarksDetails /> )} />
        <Route path="/admin/results" element={adminRoute( <AdminResults /> )} />
        <Route path="/admin/report-cards" element={adminRoute( <ReportCards /> )} />
        <Route path="/admin/report-card/:studentId" element={adminRoute( <ReportCardDetails /> )} />
        <Route path="/admin/academic-years" element={adminRoute( <AcademicYears /> )} />
        <Route path="/admin/teachers" element={adminRoute( <TeacherList /> )}/>
        <Route path="/admin/teachers/add" element={adminRoute( <AddTeacher /> )} />
        <Route path="/admin/teachers/:id" element={adminRoute( <AdminTeacherProfile /> )} />
        <Route path="/admin/announcements" element={adminRoute( <Announcements /> )} />
        <Route path="/admin/results" element={adminRoute( <AdminResults /> )} />
        <Route path="/admin/report-card/:id" element={adminRoute( <AdminReportCard/> )} />

        <Route path="/student" element={studentRoute( <StudentDashboard /> )} />
        <Route path="/student/home" element={studentRoute( <StudentDashboard /> )} />
        <Route path="/student/profile" element={studentRoute( <MyProfile /> )} />
        <Route path="/student/subjects" element={studentRoute( <MySubjects /> )} />
        <Route path="/student/attendance" element={studentRoute( <MyAttendance /> )} />
        <Route path="/student/results" element={studentRoute( <MyResults /> )} />
        <Route path="/student/report-card" element={studentRoute( <MyReportCard /> )} />
        <Route path="/student/student-announcements" element={studentRoute( <StudentAnnouncements /> )} />
        
        <Route path="/teacher" element={teacherRoute( <TeacherDashboard /> )} />
        <Route path="/teacher/classes" element={teacherRoute( <TeacherClasses /> )} />
        <Route path="/teacher/students" element={teacherRoute( <TeacherStudents /> )} />
        <Route path="/teacher/attendance" element={teacherRoute( <TeacherAttendance /> )} />
        <Route path="/teacher/marks" element={teacherRoute( <TeacherMarks /> )} />
        <Route path="/teacher/profile" element={teacherRoute( <TeacherProfile /> )} />
        <Route path="/teacher/announcements" element={teacherRoute( <TeacherAnnouncements /> )} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
