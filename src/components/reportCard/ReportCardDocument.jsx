import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import styles from "./ReportCardStyles";

function ReportCardDocument({ report }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>ABC PUBLIC SCHOOL</Text>
          <Text style={styles.reportTitle}>REPORT CARD</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.left}>
            <Text>Student ID : {report?.student?.studentId || "-"}</Text>
            <Text>Name : {report?.student?.name || "-"}</Text>
            <Text>Class : {report?.student?.classId || "-"}</Text>
            <Text>Exam : {report?.examType || "-"}</Text>
            <Text>Academic Year : {report?.academicYear || "-"}</Text>
          </View>

          <View style={styles.right}>
            <Image
              style={styles.photo}
              src={report?.student?.photo || "https://placehold.co/100x100"}
            />
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.cell}>Subject</Text>
            <Text style={styles.cell}>Marks</Text>
            <Text style={styles.cell}>Max</Text>
          </View>

          {(report?.subjects || []).map((subject) => (
            <View style={styles.tableRow} key={subject.subjectId}>
              <Text style={styles.cell}>{subject.subjectName || subject.subjectId}</Text>
              <Text style={styles.cell}>{subject.marks}</Text>
              <Text style={styles.cell}>{subject.maxMarks}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text>Obtained : {report?.obtained || 0}/{report?.total || 0}</Text>
          <Text>Percentage : {report?.percentage || 0}%</Text>
          <Text>Grade : {report?.grade || "-"}</Text>
          <Text>Status : {report?.status || "-"}</Text>
          <Text>Attendance : {report?.attendancePercentage || 0}%</Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text>____________________</Text>
            <Text style={styles.signature}>Class Teacher</Text>
          </View>

          <View>
            <Text>____________________</Text>
            <Text style={styles.signature}>Principal</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default ReportCardDocument;