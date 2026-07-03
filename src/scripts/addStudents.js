const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.project_id) {
  throw new Error("serviceAccountKey.json is missing required Firebase Admin fields.");
}

admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const db = getFirestore();

function normalizeStudent(student) {
  return {
    name: String(student.name || "").trim(),
    password: String(student.password || "").trim(),
    classId: Number(student.classId),
    selectedSubjects: Array.isArray(student.selectedSubjects)
      ? student.selectedSubjects.map(Number)
      : [],
    gender: String(student.gender || "").trim(),
    dob: String(student.dob || "").trim(),
    mobile: String(student.mobile || "").trim(),
    parentName: String(student.parentName || "").trim(),
    parentContact: String(student.parentContact || "").trim(),
    address: String(student.address || "").trim(),
    admissionDate: String(student.admissionDate || "").trim(),
    active: student.active !== false,
    photo: String(student.photo || "").trim(),
  };
}

async function main() {
  const filePath = path.join(__dirname, "..", "students.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const students = JSON.parse(raw);

  if (!Array.isArray(students)) {
    throw new Error("students.json must contain an array of students.");
  }

  const batch = db.batch();
  const collectionRef = db.collection("students");

  students.forEach((student) => {
    const data = normalizeStudent(student);
    const docRef = collectionRef.doc();
    batch.set(docRef, data);
  });

  await batch.commit();
  console.log(`Added ${students.length} students successfully.`);
}

main().catch((error) => {
  console.error("Error adding students:", error);
  process.exit(1);
});
