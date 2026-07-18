import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportCardDocument from "./ReportCardDocument";

function ReportCardPDF({ report }) {
  if (!report) {
    return null;
  }

  return (
    <PDFDownloadLink
      document={<ReportCardDocument report={report} />}
      fileName={`${report.student?.studentId || "student"}_${report.examType || "report"}.pdf`}
      className="report-card-download"
    >
      {({ loading }) => (
        <button type="button" disabled={loading}>
          {loading ? "Generating..." : "Download Report Card"}
        </button>
      )}
    </PDFDownloadLink>
  );
}

export default ReportCardPDF;
