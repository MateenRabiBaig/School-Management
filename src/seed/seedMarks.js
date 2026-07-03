import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

// -----------------------------
// SUBJECT MAP (your existing IDs)
// -----------------------------
const SUBJECTS_BY_CLASS = {
    1: { // 10th
        compulsory: [1, 2, 3],
        optional: {
            4: "English",
            5: "Hindi"
        }
    },
    2: { // 11th
        compulsory: [6, 7],
        optional: {
            8: "Maths",
            9: "Biology"
        }
    },
    3: { // 12th
        compulsory: [10, 11],
        optional: {
            12: "Advanced Maths",
            13: "Advanced Biology"
        }
    }
};

// -----------------------------
// RANDOM MARK GENERATOR
// -----------------------------
function generateMarks() {
    const base = Math.floor(Math.random() * 40) + 50; // 50–90
    const variation = Math.floor(Math.random() * 20) - 10;
    let marks = base + variation;

    if (marks > 100) marks = 100;
    if (marks < 30) marks = 30;

    return String(marks);
}

// -----------------------------
// MAIN FUNCTION
// -----------------------------
async function seedMarks() {
    try {
        const studentsSnap = await getDocs(collection(db, "students"));

        for (const docSnap of studentsSnap.docs) {
            const student = docSnap.data();
            const studentId = docSnap.id;

            const classData = SUBJECTS_BY_CLASS[student.classId];

            if (!classData) continue;

            // -------- compulsory subjects --------
            for (const subjectId of classData.compulsory) {
                await addDoc(collection(db, "marks"), {
                    studentId,
                    subjectId,
                    examType: "Test 1",
                    marks: generateMarks()
                });

                await addDoc(collection(db, "marks"), {
                    studentId,
                    subjectId,
                    examType: "Test 2",
                    marks: generateMarks()
                });
            }

            // -------- optional subject --------
            if (student.selectedSubjects && student.selectedSubjects.length > 0) {
                const optionalSubjectId = student.selectedSubjects[0];

                await addDoc(collection(db, "marks"), {
                    studentId,
                    subjectId: optionalSubjectId,
                    examType: "Test 1",
                    marks: generateMarks()
                });

                await addDoc(collection(db, "marks"), {
                    studentId,
                    subjectId: optionalSubjectId,
                    examType: "Test 2",
                    marks: generateMarks()
                });
            }

            console.log(`Marks added for: ${student.name}`);
        }

        console.log("\n✅ All marks seeded successfully");
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedMarks();