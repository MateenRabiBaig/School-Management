import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

// Generate 10 working days (Mon-Fri)
function getWorkingDays() {
    const dates = [];
    let current = new Date("2026-06-01");

    while (dates.length < 10) {
        const day = current.getDay(); // 0 = Sun, 6 = Sat

        if (day !== 0 && day !== 6) {
            const dd = String(current.getDate()).padStart(2, "0");
            const mm = String(current.getMonth() + 1).padStart(2, "0");
            const yyyy = current.getFullYear();

            dates.push(`${dd}/${mm}/${yyyy}`);
        }

        current.setDate(current.getDate() + 1);
    }

    return dates;
}

// 90% Present, 10% Absent
function getAttendanceStatus() {
    return Math.random() < 0.9 ? "Present" : "Absent";
}

async function seedAttendance() {
    try {
        const studentSnapshot = await getDocs(collection(db, "students"));
        const workingDays = getWorkingDays();

        let totalRecords = 0;

        for (const studentDoc of studentSnapshot.docs) {
            const studentId = studentDoc.id;
            const student = studentDoc.data();

            for (const date of workingDays) {
                await addDoc(collection(db, "attendance"), {
                    studentId,
                    date,
                    status: getAttendanceStatus()
                });

                totalRecords++;
            }

            console.log(`✔ Attendance added for ${student.name}`);
        }

        console.log("\n=================================");
        console.log(`✅ Attendance Seed Completed`);
        console.log(`📅 Working Days : ${workingDays.length}`);
        console.log(`👨‍🎓 Students     : ${studentSnapshot.size}`);
        console.log(`📝 Records       : ${totalRecords}`);
        console.log("=================================\n");

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAttendance();