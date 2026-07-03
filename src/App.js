import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
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
import Results from "./pages/admin/marks/Results";
import MySubjects from "./pages/student/MySubjects";
import MyAttendance from "./pages/student/MyAttendance";
import MyResults from "./pages/student/MyResults";
import MyProfile from "./pages/student/MyProfile";
import ReportCards from "./pages/admin/ReportCards";
import ReportCardDetails from "./pages/admin/ReportCardDetails";
import MyReportCard from "./pages/student/MyReportCard";
import Announcements from "./pages/admin/Announcements";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="/admin/home" element={<AdminDashboard />}></Route>
          <Route path="/admin/students" element={<StudentList />}></Route>
          <Route path="/admin/students/add" element={<AddStudent />}></Route>
          <Route path="/admin/students/:id" element={<StudentProfile />}></Route>
          <Route path="/admin/attendance" element={<MarkAttendance />}></Route>
          <Route path="/admin/attendance/records" element={<AttendanceRecords />}></Route>
          <Route path="/admin/marks" element={<AddMarks />}></Route>
          <Route path="/admin/marks/list" element={<MarksList />}></Route>
          <Route path="/admin/marks/details/:studentId/:subjectId" element={<MarksDetails />}></Route>
          <Route path="/admin/results" element={<Results />}></Route>
          <Route path="/admin/report-cards" element={<ReportCards />}></Route>
          <Route path="/admin/report-card/:studentId" element={<ReportCardDetails />}></Route>
          <Route path="/admin/teachers" element={<TeacherList />}></Route>
          <Route path="/admin/teachers/add" element={<AddTeacher />}></Route>
          <Route path="/admin/teachers/:id" element={<AdminTeacherProfile />}></Route>
          <Route path="/admin/announcements" element={<Announcements />}></Route>

          <Route path="/student" element={<StudentDashboard />}></Route>
          <Route path="/student/home" element={<StudentDashboard />}></Route>
          <Route path="/student/profile" element={<MyProfile />}></Route>
          <Route path="/student/subjects" element={<MySubjects />}></Route>
          <Route path="/student/attendance" element={<MyAttendance />}></Route>
          <Route path="/student/results" element={<MyResults />}></Route>
          <Route path="/student/report-card" element={<MyReportCard />}></Route>
          <Route path="/student/student-announcements" element={<StudentAnnouncements />}></Route>

          
          {/* <Route path="/manageStudents" element={<ManageStudents />}></Route>
          <Route path="/manageAttendance" element={<ManageAttendance />}></Route>
          <Route path="/manageMarks" element={<ManageMarks />}></Route> */}

          <Route path="/teacher" element={<TeacherDashboard />}></Route>
          <Route path="/teacher/classes" element={<TeacherClasses />}></Route>
          <Route path="/teacher/students" element={<TeacherStudents />}></Route>
          <Route path="/teacher/attendance" element={<TeacherAttendance />}></Route>
          <Route path="/teacher/marks" element={<TeacherMarks />}></Route>
          <Route path="/teacher/profile" element={<TeacherProfile />}></Route>
          <Route path="/teacher/announcements" element={<TeacherAnnouncements />}></Route>
        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
