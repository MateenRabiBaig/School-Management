import { StyleSheet } from "@react-pdf/renderer";

export default StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  header: {
    textAlign: "center",
    marginBottom: 20,
  },

  schoolName: {
    fontSize: 22,
    fontWeight: "bold",
  },

  reportTitle: {
    fontSize: 16,
    marginTop: 4,
  },

  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  left: {
    width: "65%",
  },

  right: {
    width: "30%",
    alignItems: "center",
  },

  photo: {
    width: 90,
    height: 90,
    borderWidth: 1,
  },

  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    marginTop: 20,
  },

  tableRow: {
    flexDirection: "row",
  },

  tableHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },

  cell: {
    width: "33.33%",
    borderWidth: 1,
    padding: 6,
  },

  summary: {
    marginTop: 20,
  },

  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signature: {
    textAlign: "center",
  },
});
