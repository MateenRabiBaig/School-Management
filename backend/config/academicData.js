const Subjects = [
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
    { id: 13, name: "Advanced Biology" }
]

const Classes = [
    { id: 1, name: "10th", compulsorySubjects: [1,2,3], optionalSubjects: [{ groupName: "Choose one", subjects: [4,5] }] },
    { id: 2, name: "11th", compulsorySubjects: [6,7], optionalSubjects: [{ groupName: "Choose one", subjects: [8,9] }] },
    { id: 3, name: "12th", compulsorySubjects: [10,11], optionalSubjects: [{ groupName: "Choose one", subjects: [12,13] }] }
]

module.exports = { Subjects, Classes }