import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const teachers = [
    // ---------- 10th ----------
    {
        teacherId: 1,
        name: "Rahul Verma",
        email: "rahul.verma@school.com",
        gender: "Male",
        mobile: "9876500001",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [1],
        subjectIds: [1]
    },
    {
        teacherId: 2,
        name: "Priya Sharma",
        email: "priya.sharma@school.com",
        gender: "Female",
        mobile: "9876500002",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [1],
        subjectIds: [2]
    },
    {
        teacherId: 3,
        name: "Deepak Singh",
        email: "deepak.singh@school.com",
        gender: "Male",
        mobile: "9876500003",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [1],
        subjectIds: [3]
    },
    {
        teacherId: 4,
        name: "Neha Kapoor",
        email: "neha.kapoor@school.com",
        gender: "Female",
        mobile: "9876500004",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [1],
        subjectIds: [4]
    },
    {
        teacherId: 5,
        name: "Amit Kumar",
        email: "amit.kumar@school.com",
        gender: "Male",
        mobile: "9876500005",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [1],
        subjectIds: [5]
    },

    // ---------- 11th ----------
    {
        teacherId: 6,
        name: "Sanjana Reddy",
        email: "sanjana.reddy@school.com",
        gender: "Female",
        mobile: "9876500006",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [2],
        subjectIds: [6]
    },
    {
        teacherId: 7,
        name: "Arjun Nair",
        email: "arjun.nair@school.com",
        gender: "Male",
        mobile: "9876500007",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [2],
        subjectIds: [7]
    },
    {
        teacherId: 8,
        name: "Sneha Joshi",
        email: "sneha.joshi@school.com",
        gender: "Female",
        mobile: "9876500008",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [2],
        subjectIds: [8]
    },
    {
        teacherId: 9,
        name: "Karthik Rao",
        email: "karthik.rao@school.com",
        gender: "Male",
        mobile: "9876500009",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [2],
        subjectIds: [9]
    },

    // ---------- 12th ----------
    {
        teacherId: 10,
        name: "Vikram Patel",
        email: "vikram.patel@school.com",
        gender: "Male",
        mobile: "9876500010",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [3],
        subjectIds: [10]
    },
    {
        teacherId: 11,
        name: "Meera Iyer",
        email: "meera.iyer@school.com",
        gender: "Female",
        mobile: "9876500011",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [3],
        subjectIds: [11]
    },
    {
        teacherId: 12,
        name: "Rohit Deshmukh",
        email: "rohit.deshmukh@school.com",
        gender: "Male",
        mobile: "9876500012",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [3],
        subjectIds: [12]
    },
    {
        teacherId: 13,
        name: "Anjali Menon",
        email: "anjali.menon@school.com",
        gender: "Female",
        mobile: "9876500013",
        joiningDate: "2026-04-01",
        password: "1234",
        photo: "",
        active: true,
        classIds: [3],
        subjectIds: [13]
    }
];

async function seedTeachers() {
    try {
        for (const teacher of teachers) {
            await addDoc(collection(db, "teachers"), teacher);
            console.log(`Added ${teacher.name}`);
        }

        console.log("\n✅ All teachers added successfully.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedTeachers();