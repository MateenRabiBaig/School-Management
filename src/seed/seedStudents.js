import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

// ---------- helper ----------
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- DATA ----------
const students = [
    // ================= 10th CLASS =================
    {
        name: "Aarav Mehta",
        gender: "Male",
        dob: "2007-05-12",
        address: "Mumbai",
        mobile: "9000011111",
        parentName: "Raj Mehta",
        parentContact: "9000099991",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 1,
        active: true,
        photo: "",
        selectedSubjects: [4] // English
    },
    {
        name: "Isha Verma",
        gender: "Female",
        dob: "2007-08-21",
        address: "Delhi",
        mobile: "9000011112",
        parentName: "Amit Verma",
        parentContact: "9000099992",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 1,
        active: true,
        photo: "",
        selectedSubjects: [5] // Hindi
    },
    {
        name: "Rohan Gupta",
        gender: "Male",
        dob: "2007-02-15",
        address: "Pune",
        mobile: "9000011113",
        parentName: "Suresh Gupta",
        parentContact: "9000099993",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 1,
        active: true,
        photo: "",
        selectedSubjects: [4]
    },
    {
        name: "Sneha Iyer",
        gender: "Female",
        dob: "2007-12-09",
        address: "Chennai",
        mobile: "9000011114",
        parentName: "Ravi Iyer",
        parentContact: "9000099994",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 1,
        active: true,
        photo: "",
        selectedSubjects: [5]
    },
    {
        name: "Aditya Rao",
        gender: "Male",
        dob: "2007-06-30",
        address: "Hyderabad",
        mobile: "9000011115",
        parentName: "Kiran Rao",
        parentContact: "9000099995",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 1,
        active: true,
        photo: "",
        selectedSubjects: [4]
    },

    // ================= 11th CLASS =================
    {
        name: "Kavya Nair",
        gender: "Female",
        dob: "2006-03-11",
        address: "Kochi",
        mobile: "9000022221",
        parentName: "Suresh Nair",
        parentContact: "9000098881",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 2,
        active: true,
        photo: "",
        selectedSubjects: [8] // Maths
    },
    {
        name: "Aryan Singh",
        gender: "Male",
        dob: "2006-09-18",
        address: "Lucknow",
        mobile: "9000022222",
        parentName: "Vikram Singh",
        parentContact: "9000098882",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 2,
        active: true,
        photo: "",
        selectedSubjects: [9] // Biology
    },
    {
        name: "Meera Joshi",
        gender: "Female",
        dob: "2006-01-27",
        address: "Jaipur",
        mobile: "9000022223",
        parentName: "Anil Joshi",
        parentContact: "9000098883",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 2,
        active: true,
        photo: "",
        selectedSubjects: [8]
    },
    {
        name: "Yash Patel",
        gender: "Male",
        dob: "2006-07-14",
        address: "Ahmedabad",
        mobile: "9000022224",
        parentName: "Bhavesh Patel",
        parentContact: "9000098884",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 2,
        active: true,
        photo: "",
        selectedSubjects: [9]
    },
    {
        name: "Diya Sharma",
        gender: "Female",
        dob: "2006-10-05",
        address: "Bhopal",
        mobile: "9000022225",
        parentName: "Rakesh Sharma",
        parentContact: "9000098885",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 2,
        active: true,
        photo: "",
        selectedSubjects: [8]
    },

    // ================= 12th CLASS =================
    {
        name: "Vivek Malhotra",
        gender: "Male",
        dob: "2005-04-22",
        address: "Delhi",
        mobile: "9000033331",
        parentName: "Deepak Malhotra",
        parentContact: "9000097771",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 3,
        active: true,
        photo: "",
        selectedSubjects: [12] // Adv Maths
    },
    {
        name: "Ananya Iyer",
        gender: "Female",
        dob: "2005-11-19",
        address: "Chennai",
        mobile: "9000033332",
        parentName: "Arun Iyer",
        parentContact: "9000097772",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 3,
        active: true,
        photo: "",
        selectedSubjects: [13] // Adv Biology
    },
    {
        name: "Kabir Khan",
        gender: "Male",
        dob: "2005-06-08",
        address: "Mumbai",
        mobile: "9000033333",
        parentName: "Imran Khan",
        parentContact: "9000097773",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 3,
        active: true,
        photo: "",
        selectedSubjects: [12]
    },
    {
        name: "Pooja Desai",
        gender: "Female",
        dob: "2005-02-14",
        address: "Surat",
        mobile: "9000033334",
        parentName: "Nitin Desai",
        parentContact: "9000097774",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 3,
        active: true,
        photo: "",
        selectedSubjects: [13]
    },
    {
        name: "Harsh Vardhan",
        gender: "Male",
        dob: "2005-09-30",
        address: "Indore",
        mobile: "9000033335",
        parentName: "Sanjay Vardhan",
        parentContact: "9000097775",
        admissionDate: "2024-04-01",
        password: "1234",
        classId: 3,
        active: true,
        photo: "",
        selectedSubjects: [12]
    }
];

// ---------- SEED FUNCTION ----------
async function seedStudents() {
    try {
        for (const student of students) {
            const docRef = await addDoc(collection(db, "students"), student);
            console.log(`Added: ${student.name} -> ${docRef.id}`);
        }

        console.log("\n✅ Students seeded successfully");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedStudents();