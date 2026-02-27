// ============ STUDENTS ============
export const students = [
  { id: "STU001", name: "Aarav Sharma", email: "aarav.sharma@nit.edu", phone: "9876543210", department: "CSE", semester: 5, deviceId: "DEV-A1B2C3", attendance: 87, parentPhone: "9812345678", parentEmail: "parent.sharma@gmail.com" },
  { id: "STU002", name: "Priya Patel", email: "priya.patel@nit.edu", phone: "9876543211", department: "CSE", semester: 5, deviceId: "DEV-D4E5F6", attendance: 72, parentPhone: "9812345679", parentEmail: "parent.patel@gmail.com" },
  { id: "STU003", name: "Rahul Verma", email: "rahul.verma@nit.edu", phone: "9876543212", department: "CSE", semester: 5, deviceId: "DEV-G7H8I9", attendance: 91, parentPhone: "9812345680", parentEmail: "parent.verma@gmail.com" },
  { id: "STU004", name: "Sneha Reddy", email: "sneha.reddy@nit.edu", phone: "9876543213", department: "ECE", semester: 5, deviceId: "DEV-J1K2L3", attendance: 65, parentPhone: "9812345681", parentEmail: "parent.reddy@gmail.com" },
  { id: "STU005", name: "Vikram Singh", email: "vikram.singh@nit.edu", phone: "9876543214", department: "ECE", semester: 5, deviceId: "DEV-M4N5O6", attendance: 78, parentPhone: "9812345682", parentEmail: "parent.singh@gmail.com" },
  { id: "STU006", name: "Ananya Gupta", email: "ananya.gupta@nit.edu", phone: "9876543215", department: "ME", semester: 3, deviceId: "DEV-P7Q8R9", attendance: 82, parentPhone: "9812345683", parentEmail: "parent.gupta@gmail.com" },
  { id: "STU007", name: "Karthik Nair", email: "karthik.nair@nit.edu", phone: "9876543216", department: "CSE", semester: 5, deviceId: "DEV-S1T2U3", attendance: 69, parentPhone: "9812345684", parentEmail: "parent.nair@gmail.com" },
  { id: "STU008", name: "Divya Iyer", email: "divya.iyer@nit.edu", phone: "9876543217", department: "CSE", semester: 5, deviceId: "DEV-V4W5X6", attendance: 94, parentPhone: "9812345685", parentEmail: "parent.iyer@gmail.com" },
  { id: "STU009", name: "Arjun Mehta", email: "arjun.mehta@nit.edu", phone: "9876543218", department: "ECE", semester: 3, deviceId: "DEV-Y7Z8A1", attendance: 58, parentPhone: "9812345686", parentEmail: "parent.mehta@gmail.com" },
  { id: "STU010", name: "Meera Joshi", email: "meera.joshi@nit.edu", phone: "9876543219", department: "ME", semester: 3, deviceId: "DEV-B2C3D4", attendance: 88, parentPhone: "9812345687", parentEmail: "parent.joshi@gmail.com" },
];

// ============ FACULTY ============
export const faculty = [
  { id: "FAC001", name: "Dr. Rajesh Kumar", email: "rajesh.kumar@nit.edu", department: "CSE", designation: "Professor" },
  { id: "FAC002", name: "Dr. Sunita Desai", email: "sunita.desai@nit.edu", department: "CSE", designation: "Associate Professor" },
  { id: "FAC003", name: "Dr. Anil Prasad", email: "anil.prasad@nit.edu", department: "ECE", designation: "Professor" },
  { id: "FAC004", name: "Dr. Kavitha Rajan", email: "kavitha.rajan@nit.edu", department: "ME", designation: "Assistant Professor" },
];

// ============ COURSES ============
export const courses = [
  { id: "CS301", name: "Data Structures & Algorithms", department: "CSE", semester: 5, credits: 4, faculty: "FAC001", totalSessions: 45, completedSessions: 32 },
  { id: "CS302", name: "Database Management Systems", department: "CSE", semester: 5, credits: 4, faculty: "FAC002", totalSessions: 40, completedSessions: 28 },
  { id: "CS303", name: "Operating Systems", department: "CSE", semester: 5, credits: 3, faculty: "FAC001", totalSessions: 35, completedSessions: 25 },
  { id: "EC301", name: "Digital Signal Processing", department: "ECE", semester: 5, credits: 4, faculty: "FAC003", totalSessions: 42, completedSessions: 30 },
  { id: "ME201", name: "Thermodynamics", department: "ME", semester: 3, credits: 3, faculty: "FAC004", totalSessions: 38, completedSessions: 26 },
];

// ============ COURSE OUTCOMES ============
export const courseOutcomes = [
  { id: "CO1", courseId: "CS301", description: "Analyze time & space complexity of algorithms", bloomLevel: "Analyze", attainment: 72 },
  { id: "CO2", courseId: "CS301", description: "Implement tree and graph data structures", bloomLevel: "Apply", attainment: 68 },
  { id: "CO3", courseId: "CS301", description: "Design efficient sorting & searching algorithms", bloomLevel: "Create", attainment: 75 },
  { id: "CO4", courseId: "CS302", description: "Design normalized relational database schemas", bloomLevel: "Create", attainment: 80 },
  { id: "CO5", courseId: "CS302", description: "Write complex SQL queries with joins & subqueries", bloomLevel: "Apply", attainment: 65 },
  { id: "CO6", courseId: "CS303", description: "Explain process scheduling algorithms", bloomLevel: "Understand", attainment: 78 },
];

// ============ SESSIONS ============
export const sessions = [
  { id: "SES001", courseId: "CS301", topic: "Binary Search Trees", coId: "CO2", date: "2026-02-27", time: "09:00", room: "LH-201", facultyId: "FAC001", status: "upcoming", present: 0, total: 60 },
  { id: "SES002", courseId: "CS301", topic: "AVL Tree Rotations", coId: "CO2", date: "2026-02-26", time: "09:00", room: "LH-201", facultyId: "FAC001", status: "completed", present: 52, total: 60 },
  { id: "SES003", courseId: "CS302", topic: "SQL Joins", coId: "CO5", date: "2026-02-27", time: "11:00", room: "LH-305", facultyId: "FAC002", status: "upcoming", present: 0, total: 58 },
  { id: "SES004", courseId: "CS302", topic: "Normalization (3NF)", coId: "CO4", date: "2026-02-26", time: "11:00", room: "LH-305", facultyId: "FAC002", status: "completed", present: 48, total: 58 },
  { id: "SES005", courseId: "CS303", topic: "Round Robin Scheduling", coId: "CO6", date: "2026-02-27", time: "14:00", room: "LH-102", facultyId: "FAC001", status: "upcoming", present: 0, total: 55 },
  { id: "SES006", courseId: "CS301", topic: "Graph BFS & DFS", coId: "CO2", date: "2026-02-25", time: "09:00", room: "LH-201", facultyId: "FAC001", status: "completed", present: 55, total: 60 },
  { id: "SES007", courseId: "CS302", topic: "ER Diagrams", coId: "CO4", date: "2026-02-24", time: "11:00", room: "LH-305", facultyId: "FAC002", status: "completed", present: 50, total: 58 },
  { id: "SES008", courseId: "EC301", topic: "DFT & FFT", coId: "CO1", date: "2026-02-27", time: "10:00", room: "LH-401", facultyId: "FAC003", status: "upcoming", present: 0, total: 50 },
];

// ============ ATTENDANCE LOGS ============
export const attendanceLogs = [
  { id: "ATT001", studentId: "STU001", sessionId: "SES002", status: "present" as const, timestamp: "2026-02-26T09:03:22", method: "QR", gpsValid: true, ipValid: true },
  { id: "ATT002", studentId: "STU001", sessionId: "SES004", status: "present" as const, timestamp: "2026-02-26T11:02:15", method: "QR", gpsValid: true, ipValid: true },
  { id: "ATT003", studentId: "STU001", sessionId: "SES006", status: "present" as const, timestamp: "2026-02-25T09:01:45", method: "QR", gpsValid: true, ipValid: true },
  { id: "ATT004", studentId: "STU001", sessionId: "SES007", status: "late" as const, timestamp: "2026-02-24T11:14:30", method: "QR", gpsValid: true, ipValid: true },
  { id: "ATT005", studentId: "STU002", sessionId: "SES002", status: "absent" as const, timestamp: "", method: "", gpsValid: false, ipValid: false },
  { id: "ATT006", studentId: "STU002", sessionId: "SES004", status: "present" as const, timestamp: "2026-02-26T11:05:00", method: "QR", gpsValid: true, ipValid: true },
  { id: "ATT007", studentId: "STU003", sessionId: "SES002", status: "present" as const, timestamp: "2026-02-26T09:00:55", method: "QR", gpsValid: true, ipValid: true },
  { id: "ATT008", studentId: "STU004", sessionId: "SES002", status: "absent" as const, timestamp: "", method: "", gpsValid: false, ipValid: false },
  { id: "ATT009", studentId: "STU001", sessionId: "SES001", status: "present" as const, timestamp: "2026-02-27T09:02:10", method: "QR", gpsValid: true, ipValid: true },
  { id: "ATT010", studentId: "STU005", sessionId: "SES002", status: "late" as const, timestamp: "2026-02-26T09:12:30", method: "QR", gpsValid: true, ipValid: false },
];

// ============ LEAVES ============
export const leaves = [
  { id: "LEA001", studentId: "STU001", type: "Medical", startDate: "2026-02-20", endDate: "2026-02-21", reason: "Fever and cold", status: "approved" as const, document: "medical_cert.pdf" },
  { id: "LEA002", studentId: "STU002", type: "On-Duty", startDate: "2026-02-25", endDate: "2026-02-25", reason: "Inter-college hackathon", status: "pending" as const, document: "od_letter.pdf" },
  { id: "LEA003", studentId: "STU004", type: "Medical", startDate: "2026-02-22", endDate: "2026-02-24", reason: "Hospitalized for dengue", status: "approved" as const, document: "hospital_report.pdf" },
  { id: "LEA004", studentId: "STU007", type: "Personal", startDate: "2026-02-18", endDate: "2026-02-18", reason: "Family function", status: "rejected" as const, document: "" },
];

// ============ TIMETABLE ============
export const timetable = [
  { day: "Monday", slots: [
    { time: "09:00-10:00", courseId: "CS301", room: "LH-201", facultyId: "FAC001" },
    { time: "11:00-12:00", courseId: "CS302", room: "LH-305", facultyId: "FAC002" },
    { time: "14:00-15:00", courseId: "CS303", room: "LH-102", facultyId: "FAC001" },
  ]},
  { day: "Tuesday", slots: [
    { time: "09:00-10:00", courseId: "EC301", room: "LH-401", facultyId: "FAC003" },
    { time: "11:00-12:00", courseId: "ME201", room: "LH-501", facultyId: "FAC004" },
    { time: "14:00-15:00", courseId: "CS301", room: "LH-201", facultyId: "FAC001" },
  ]},
  { day: "Wednesday", slots: [
    { time: "09:00-10:00", courseId: "CS302", room: "LH-305", facultyId: "FAC002" },
    { time: "11:00-12:00", courseId: "CS303", room: "LH-102", facultyId: "FAC001" },
    { time: "14:00-15:00", courseId: "EC301", room: "LH-401", facultyId: "FAC003" },
  ]},
  { day: "Thursday", slots: [
    { time: "09:00-10:00", courseId: "CS301", room: "LH-201", facultyId: "FAC001" },
    { time: "11:00-12:00", courseId: "ME201", room: "LH-501", facultyId: "FAC004" },
    { time: "14:00-15:00", courseId: "CS302", room: "LH-305", facultyId: "FAC002" },
  ]},
  { day: "Friday", slots: [
    { time: "09:00-10:00", courseId: "CS303", room: "LH-102", facultyId: "FAC001" },
    { time: "11:00-12:00", courseId: "EC301", room: "LH-401", facultyId: "FAC003" },
    { time: "14:00-15:00", courseId: "ME201", room: "LH-501", facultyId: "FAC004" },
  ]},
];

// ============ DEPARTMENTS ============
export const departments = [
  { id: "CSE", name: "Computer Science & Engineering", hod: "Dr. Rajesh Kumar", totalStudents: 240, avgAttendance: 79 },
  { id: "ECE", name: "Electronics & Communication", hod: "Dr. Anil Prasad", totalStudents: 180, avgAttendance: 74 },
  { id: "ME", name: "Mechanical Engineering", hod: "Dr. Kavitha Rajan", totalStudents: 150, avgAttendance: 81 },
];

// ============ HELPERS ============
export const getCourseName = (id: string) => courses.find(c => c.id === id)?.name ?? id;
export const getFacultyName = (id: string) => faculty.find(f => f.id === id)?.name ?? id;
export const getStudentName = (id: string) => students.find(s => s.id === id)?.name ?? id;

export type AttendanceStatus = "present" | "late" | "absent";
export type LeaveStatus = "pending" | "approved" | "rejected";
export type Role = "student" | "faculty" | "admin";
