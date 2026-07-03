import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const announcements = [
    {
        title: "Welcome to the New Academic Year",
        message: "We welcome all students to the new academic session. Wishing everyone a successful year ahead!",
        type: "General",
        createdDate: "2026-06-01",
        active: true
    },
    {
        title: "Unit Test 1 Schedule",
        message: "Unit Test 1 will begin from 15th June. Students are advised to prepare according to the timetable.",
        type: "Exam",
        createdDate: "2026-06-08",
        active: true
    },
    {
        title: "School Holiday",
        message: "School will remain closed on 29th June due to a public holiday.",
        type: "Holiday",
        createdDate: "2026-06-15",
        active: true
    },
    {
        title: "Midterm Examination",
        message: "Midterm examinations will commence from 20th July. The detailed timetable will be shared soon.",
        type: "Exam",
        createdDate: "2026-07-01",
        active: true
    },
    {
        title: "Library Books Return",
        message: "Students are requested to return all overdue library books before 10th July to avoid late fees.",
        type: "General",
        createdDate: "2026-07-05",
        active: true
    },
    {
        title: "Independence Day Holiday",
        message: "School will remain closed on 15th August in observance of Independence Day.",
        type: "Holiday",
        createdDate: "2026-08-10",
        active: true
    },
    {
        title: "Unit Test 2 Schedule",
        message: "Unit Test 2 will begin from 5th September. Students should complete all pending assignments before the exams.",
        type: "Exam",
        createdDate: "2026-08-25",
        active: true
    },
    {
        title: "School Reopens",
        message: "School will reopen on Monday after the vacation. Students are requested to report on time.",
        type: "General",
        createdDate: "2026-09-01",
        active: true
    }
];

async function seedAnnouncements() {
    try {
        for (const announcement of announcements) {
            await addDoc(collection(db, "announcements"), announcement);
            console.log(`Added: ${announcement.title}`);
        }

        console.log("✅ Announcements added successfully.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAnnouncements();