import "dotenv/config";
import prisma from "./index";
import bcrypt from "bcryptjs";
import studentsData from "../extracted_students.json";

// In Prisma 7 with adapters, we use the centralized client from index.js

async function main() {
  console.log("🌱 Starting seed...");

  const SALT = 10;
  const [adminHash, facultyHash, studentHash] = await Promise.all([
    bcrypt.hash("admin123", SALT),
    bcrypt.hash("faculty123", SALT),
    bcrypt.hash("student123", SALT),
  ]);

  // ── 1. Admin User ─────────────────────────────────────────────────────────────
  const admin = await prisma.users.upsert({
    where: { email: "admin@darshan.ac.in" },
    update: {},
    create: {
      username: "admin",
      email: "admin@darshan.ac.in",
      passwordHash: adminHash,
      role: "admin",
      status: "active",
      adminProfile: {
        create: { fullName: "System Administrator", phone: "0000000000" },
      },
    },
  });

  console.log("✅ Admin created:", admin.id);

  // ── 2. Faculty Members ───────────────────────────────────────────────────────
  const facultyData = [
    {
      fullName: "Dixita Kagathara",
      email: "dixita.kagathara@darshan.ac.in",
      username: "dixita_kagathara",
      employeeId: "FAC2026001",
      department: "Computer Science",
      designation: "Associate Professor",
      subjects: ["Automata Theory and Compiler Construction (ATCC)"],
    },
    {
      fullName: "Firoz Sherasiya",
      email: "firoz.sherasiya@darshan.ac.in",
      username: "firoz_sherasiya",
      employeeId: "FAC2026002",
      department: "Computer Science",
      designation: "Assistant Professor",
      subjects: ["Operating Systems (OS)"],
    },
    {
      fullName: "Javed Nathani",
      email: "javed.nathani@darshan.ac.in",
      username: "javed_nathani",
      employeeId: "FAC2026003",
      department: "Computer Science",
      designation: "Assistant Professor",
      subjects: ["Fundamentals of Accounting (FOA)"],
    },
    {
      fullName: "Jayesh Vagadiya",
      email: "jayesh.vagadiya@darshan.ac.in",
      username: "jayesh_vagadiya",
      employeeId: "FAC2026004",
      department: "Computer Science",
      designation: "Professor",
      subjects: [
        "Machine Learning and Deep Learning (MLDL)",
        "Machine Learning (ML)",
      ],
    },
    {
      fullName: "Arjun Bala",
      email: "arjun.bala@darshan.ac.in",
      username: "arjun_bala",
      employeeId: "FAC2026005",
      department: "Computer Science",
      designation: "Assistant Professor",
      subjects: ["Advanced Web Technologies (AWT)"],
    },
    {
      fullName: "Maulik Trivedi",
      email: "maulik.trivedi@darshan.ac.in",
      username: "maulik_trivedi",
      employeeId: "FAC2026006",
      department: "Computer Science",
      designation: "Associate Professor",
      subjects: ["Information Network Security (INS)"],
    },
    {
      fullName: "Mayur Padia",
      email: "mayur.padia@darshan.ac.in",
      username: "mayur_padia",
      employeeId: "FAC2026007",
      department: "Computer Science",
      designation: "Assistant Professor",
      subjects: ["UI/UX Design"],
    },
    {
      fullName: "Naimish Vadodariya",
      email: "naimish.vadodariya@darshan.ac.in",
      username: "naimish_vadodariya",
      employeeId: "FAC2026008",
      department: "Computer Science",
      designation: "Professor",
      subjects: [".NET", "Advanced .NET", "Advanced Advanced .NET"],
    },
    {
      fullName: "Mehul Bhundiya",
      email: "mehul.bhundiya@darshan.ac.in",
      username: "mehul_bhundiya",
      employeeId: "FAC2026012",
      department: "Computer Science",
      designation: "Assistant Professor",
      subjects: ["Flutter", "Advanced Flutter"],
    },
  ];

  const faculties = [];
  for (const faculty of facultyData) {
    const user = await prisma.users.upsert({
      where: { email: faculty.email },
      update: {},
      create: {
        username: faculty.username,
        email: faculty.email,
        passwordHash: facultyHash,
        role: "faculty",
        status: "active",
        facultyProfile: {
          create: {
            fullName: faculty.fullName,
            employeeId: faculty.employeeId,
            department: faculty.department,
            designation: faculty.designation,
          },
        },
      },
    });
    faculties.push({ ...faculty, user });
  }

  console.log("✅ Faculty created:", faculties.length, "members");

  // ── 3. Courses & Subjects ─────────────────────────────────────────────────────
  // Core Courses
  const coreCourses = [
    {
      code: "CS601",
      name: "Automata Theory and Compiler Construction (ATCC)",
      credits: 4,
      semester: 6,
      faculty: "Dixita Kagathara",
    },
    {
      code: "CS602",
      name: "Operating Systems (OS)",
      credits: 4,
      semester: 6,
      faculty: "Firoz Sherasiya",
    },
  ];

  // Elective Courses
  const electiveCourses = [
    {
      code: "CS603",
      name: "Fundamentals of Accounting (FOA)",
      credits: 4,
      semester: 6,
      faculty: "Javed Nathani",
    },
    {
      code: "CS604",
      name: "Machine Learning and Deep Learning (MLDL)",
      credits: 3,
      semester: 6,
      faculty: "Jayesh Vagadiya",
    },
    {
      code: "CS605",
      name: "Machine Learning (ML)",
      credits: 3,
      semester: 6,
      faculty: "Jayesh Vagadiya",
    },
    {
      code: "CS606",
      name: "Advanced Web Technologies (AWT)",
      credits: 3,
      semester: 6,
      faculty: "Arjun Bala",
    },
    {
      code: "CS607",
      name: "Information Network Security (INS)",
      credits: 3,
      semester: 6,
      faculty: "Maulik Trivedi",
    },
    {
      code: "CS608",
      name: "UI/UX Design",
      credits: 3,
      semester: 6,
      faculty: "Mayur Padia",
    },
    {
      code: "CS609",
      name: ".NET",
      credits: 3,
      semester: 6,
      faculty: "Naimish Vadodariya",
    },
    {
      code: "CS610",
      name: "Advanced .NET",
      credits: 3,
      semester: 6,
      faculty: "Naimish Vadodariya",
    },
    {
      code: "CS611",
      name: "Advanced Advanced .NET",
      credits: 3,
      semester: 6,
      faculty: "Naimish Vadodariya",
    },
    {
      code: "CS612",
      name: "Flutter",
      credits: 3,
      semester: 6,
      faculty: "Mehul Bhundiya",
    },
    {
      code: "CS613",
      name: "Advanced Flutter",
      credits: 3,
      semester: 6,
      faculty: "Mehul Bhundiya",
    },
    {
      code: "CS614",
      name: "Mobile Computing and Wireless Communication (MCWC)",
      credits: 3,
      semester: 6,
      faculty: "Dixita Kagathara",
    },
  ];

  const allCourses = [...coreCourses, ...electiveCourses];
  const courses: Array<{
    code: string;
    name: string;
    credits: number;
    semester: number;
    faculty: string;
    id: number;
    subjectId: number;
    facultyId: number;
  }> = [];

  for (const courseData of allCourses) {
    const faculty = faculties.find((f) => f.fullName === courseData.faculty);
    if (!faculty) {
      console.error(`Faculty not found: ${courseData.faculty}`);
      continue;
    }

    const course = await prisma.course.upsert({
      where: { code: courseData.code },
      update: {},
      create: {
        code: courseData.code,
        name: courseData.name,
        department: "Computer Science",
        credits: courseData.credits,
        semester: courseData.semester,
        totalClasses: 40,
        facultyId: faculty.user.id,
      },
    });

    // Create subject for each course
    const subject = await prisma.subject.upsert({
      where: { id: course.id },
      update: {},
      create: {
        courseId: course.id,
        name: courseData.name,
        credits: courseData.credits,
        totalClasses: 40,
      },
    });

    courses.push({
      ...courseData,
      id: course.id,
      subjectId: subject.id,
      facultyId: faculty.user.id,
    });
  }

  console.log("✅ Courses created:", courses.length, "courses");

  // ── 4. Students ──────────────────────────────────────────────────────────────
  console.log(`📡 Preparing ${studentsData.length} students for deployment...`);

  const studentOperations = studentsData.map((studentEntry) => {
    const [index, enroll, class_, rollno, name, elective1, elective2] = studentEntry;
    const batch = class_; // "A1", "A2", etc.
    const semester = 6;
    const username = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    const email = `${enroll}@darshan.ac.in`;

    const studentSubjects: any[] = [];
    coreCourses.forEach((coreCourse) => {
      const course = courses.find((c) => c.name === coreCourse.name);
      if (course) studentSubjects.push(course);
    });

    const processElective = (elective: string) => {
      if (!elective || elective === "Not Given") return;
      const normalized = elective.trim().toLowerCase();
      let mappedName = "";

      // Elective 1 Mapping
      if (normalized.includes("web technology") || normalized.includes("awt")) mappedName = "Advanced Web Technologies (AWT)";
      else if (normalized.includes("ins") || normalized.includes("security")) mappedName = "Information Network Security (INS)";
      else if (normalized.includes("ui/ux") || normalized.includes("designing")) mappedName = "UI/UX Design";
      else if (normalized.includes("asp. net core")) mappedName = ".NET";
      else if (normalized.includes("advanced .net") || normalized.includes("restful apis")) {
        if (normalized.includes("modern architecture") || normalized.includes("architectures")) mappedName = "Advanced Advanced .NET";
        else mappedName = "Advanced .NET";
      }
      else if (normalized.includes("flutter")) {
        if (normalized.includes("advanced")) mappedName = "Advanced Flutter";
        else mappedName = "Flutter";
      }

      // Elective 2 Mapping
      else if (normalized.includes("machine learning")) {
        if (normalized.includes("deep learning") || normalized.includes("mldl")) mappedName = "Machine Learning and Deep Learning (MLDL)";
        else mappedName = "Machine Learning (ML)";
      }
      else if (normalized.includes("mcwc") || normalized.includes("mobile computing")) mappedName = "Mobile Computing and Wireless Communication (MCWC)";

      // Standalone/Other Electives
      else if (normalized.includes("accounting") || normalized.includes("foa")) mappedName = "Fundamentals of Accounting (FOA)";

      if (mappedName) {
        const course = courses.find(c => c.name === mappedName);
        if (course && !studentSubjects.find(s => s.code === course.code)) {
          studentSubjects.push(course);
        }
      }
    };

    processElective(elective1);
    processElective(elective2);

    return prisma.users.create({
      data: {
        username: enroll, // Use enrollment as username
        email,
        passwordHash: studentHash,
        role: "student",
        status: "active",
        studentCourses: {
          connect: Array.from(new Set(studentSubjects.map(s => s.id))).map(id => ({ id }))
        },
        studentSubjects: {
          connect: studentSubjects.map((s) => ({ id: s.subjectId })),
        },
        studentProfile: {
          create: {
            fullName: name,
            enrollmentNumber: enroll,
            rollNumber: rollno,
            department: "Computer Science",
            batch,
            currentSemester: semester,
            parentPhone: `91${Math.floor(8000000000 + Math.random() * 1999999999)}`,
            parentEmail: `parent.${enroll}@darshan.ac.in`,
          },
        },
      }
    });
  });

  // Execute in chunks to avoid memory issues or DB connection timeouts
  const chunkSize = 50;
  for (let i = 0; i < studentOperations.length; i += chunkSize) {
    const chunk = studentOperations.slice(i, i + chunkSize);
    await Promise.all(chunk);
    process.stdout.write(`⚡ Progress: ${Math.min(i + chunkSize, studentOperations.length)}/${studentOperations.length} students synchronized...\r`);
  }
  process.stdout.write('\n');

  console.log("✅ Students created:", studentOperations.length, "students");

  console.log("🎉 Seed complete! Core data (Faculty, Courses, Students) is ready. No historical sessions or grades created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
