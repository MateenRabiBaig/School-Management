// export const Students = [
//     {
//         id: 1,
//         name: "Rahul",
//         password: 123,
//         classId: 1,
//         selectedSubjects: [1, 2]
//     },
//     {
//         id: 2,
//         name: "Aditya",
//         password: 124,
//         classId: 1,
//         selectedSubjects: [1, 4]
//     },
//     {
//         id: 3,
//         name: "Raghu",
//         password: 125,
//         classId: 1,
//         selectedSubjects: [1]
//     }
// ];

// export const Classes = [
//     {
//         id: 1,
//         name: "Class 10"
//     },
//     {
//         id: 2,
//         name: "Class 11",
//     }
// ];

// export const Subjects = [
//     {
//         id: 1,
//         name: "Maths",
//         classId: 1
//     },
//     {
//         id: 2,
//         name: "Science",
//         classId: 1
//     },
//     {
//         id: 3,
//         name: "Physics",
//         classId: 2
//     }
// ];

export const Subjects = [
    { id: 1, name: "Science" },
    { id: 2, name: "Maths" },
    { id: 3, name: "Social" },
    { id: 4, name: "English" },
    { id: 5, name: "Hindi" },

    { id: 6, name: "Physics" },
    { id: 7, name: "Chemistry" },
    { id: 8, name: "Mathematics" },
    { id: 9, name: "Biology" },

    { id: 10, name: "Advanced Physics" },
    { id: 11, name: "Advanced Chemistry" },
    { id: 12, name: "Advanced Mathematics" },
    { id: 13, name: "Advanced Biology" },
];

export const Classes = [
    {
        id: 1,
        name: "10th",
        compulsorySubjects: [1,2,3],
        optionalSubjects: [{
            groupName: "Choose one",
            subjects: [4,5]
        }]
    },
    {
        id: 2,
        name: "11th",
        compulsorySubjects: [6,7],
        optionalSubjects: [{
            groupName: "Choose one",
            subjects: [8,9]
        }]
    },
    {
        id: 3,
        name: "12th",
        compulsorySubjects: [10,11],
        optionalSubjects: [{
            groupName: "Choose one",
            subjects: [12,13]
        }]
    },
];