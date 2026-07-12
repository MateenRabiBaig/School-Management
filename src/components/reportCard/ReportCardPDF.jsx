import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportCardDocument from "./ReportCardDocument";

function ReportCardPDF({ report }) {
  if (!report) {
    return null;
  }

  return (
    <PDFDownloadLink
      document={<ReportCardDocument report={report} />}
      fileName={`${report.student.studentId}_${report.examType}.pdf`}
    >
      {({ loading }) => (loading ? "Generating..." : "Download Report Card")}
    </PDFDownloadLink>
  );
}

export default ReportCardPDF;
