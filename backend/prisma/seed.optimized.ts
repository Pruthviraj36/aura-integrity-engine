import "dotenv/config";
import prisma from "./index";
import argon2 from "argon2";
import studentsData from "../extracted_students.json";

type StudentRow = [number, string, string, string, string, string, string];

type SeedSubject = {
  id: number;
  name: string;
};

const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const normalizeElective = (elective: string): string | null => {
  if (!elective || elective === "Not Given") return null;
  const normalized = elective.trim().toLowerCase();

  if (normalized.includes("web technology") || normalized.includes("awt")) {
    return "Advanced Web Technologies (AWT)";
  }
  if (
    normalized.includes("ins") ||
    normalized.includes("information network security")
  ) {
    return "Information Network Security (INS)";
  }
  if (normalized.includes("ui/ux") || normalized.includes("designing")) {
    return "UI/UX Designing";
  }
  if (
    normalized.includes("advanced .net development") ||
    normalized.includes("modern architectures")
  ) {
    return "Advanced Advanced .NET";
  }
  if (
    normalized.includes("advanced .net") ||
    (normalized.includes("restful apis") && normalized.includes("advanced"))
  ) {
    return "Advanced .NET";
  }
  if (
    normalized.includes("asp. net core") ||
    normalized.includes("asp.net core") ||
    (normalized.includes(".net") && !normalized.includes("advanced"))
  ) {
    return ".NET";
  }
  if (normalized.includes("advanced flutter")) {
    return "Advanced Flutter";
  }
  if (normalized.includes("flutter")) {
    return "Flutter";
  }
  if (normalized.includes("machine learning")) {
    if (normalized.includes("deep learning")) {
      return "Machine Learning and Deep Learning (MLDL)";
    }
    return "Machine Learning (ML)";
  }

  return null;
};

const deterministicParentPhone = (enrollment: string) => {
  const last8 = enrollment.replace(/\D/g, "").slice(-8).padStart(8, "0");
  return `91${last8}`;
};

async function main() {
  const start = Date.now();
  console.log("🌱 Starting optimized seed...");

  const [adminHash, facultyHash, studentHash] = await Promise.all([
    argon2.hash("admin123"),
    argon2.hash("faculty123"),
    argon2.hash("student123"),
  ]);

  await prisma.users.upsert({
    where: { email: "admin@darshan.ac.in" },
    update: {
      passwordHash: adminHash,
      status: "active",
      role: "admin",
      adminProfile: {
        upsert: {
          update: { fullName: "System Administrator", phone: "0000000000" },
          create: { fullName: "System Administrator", phone: "0000000000" },
        },
      },
    },
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

  const facultyData = [
    {
      fullName: "Dixita Kagathara",
      email: "dixita.kagathara@darshan.ac.in",
      username: "dixita_kagathara",
      employeeId: "FAC2026001",
      department: "Computer Science",
      designation: "Associate Professor",
    },
    {
      fullName: "Firoz Sherasiya",
      email: "firoz.sherasiya@darshan.ac.in",
      username: "firoz_sherasiya",
      employeeId: "FAC2026002",
      department: "Computer Science",
      designation: "Assistant Professor",
    },
    {
      fullName: "Javed Nathani",
      email: "javed.nathani@darshan.ac.in",
      username: "javed_nathani",
      employeeId: "FAC2026003",
      department: "Computer Science",
      designation: "Assistant Professor",
    },
    {
      fullName: "Jayesh Vagadiya",
      email: "jayesh.vagadiya@darshan.ac.in",
      username: "jayesh_vagadiya",
      employeeId: "FAC2026004",
      department: "Computer Science",
      designation: "Professor",
    },
    {
      fullName: "Arjun Bala",
      email: "arjun.bala@darshan.ac.in",
      username: "arjun_bala",
      employeeId: "FAC2026005",
      department: "Computer Science",
      designation: "Assistant Professor",
    },
    {
      fullName: "Maulik Trivedi",
      email: "maulik.trivedi@darshan.ac.in",
      username: "maulik_trivedi",
      employeeId: "FAC2026006",
      department: "Computer Science",
      designation: "Associate Professor",
    },
    {
      fullName: "Mayur Padia",
      email: "mayur.padia@darshan.ac.in",
      username: "mayur_padia",
      employeeId: "FAC2026007",
      department: "Computer Science",
      designation: "Assistant Professor",
    },
    {
      fullName: "Naimish Vadodariya",
      email: "naimish.vadodariya@darshan.ac.in",
      username: "naimish_vadodariya",
      employeeId: "FAC2026008",
      department: "Computer Science",
      designation: "Professor",
    },
    {
      fullName: "Mehul Bhundiya",
      email: "mehul.bhundiya@darshan.ac.in",
      username: "mehul_bhundiya",
      employeeId: "FAC2026012",
      department: "Computer Science",
      designation: "Assistant Professor",
    },
  ];

  await Promise.all(
    facultyData.map((faculty) =>
      prisma.users.upsert({
        where: { email: faculty.email },
        update: {
          username: faculty.username,
          passwordHash: facultyHash,
          status: "active",
          role: "faculty",
          facultyProfile: {
            upsert: {
              update: {
                fullName: faculty.fullName,
                employeeId: faculty.employeeId,
                department: faculty.department,
                designation: faculty.designation,
              },
              create: {
                fullName: faculty.fullName,
                employeeId: faculty.employeeId,
                department: faculty.department,
                designation: faculty.designation,
              },
            },
          },
        },
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
      }),
    ),
  );

  const facultyUsers = await prisma.users.findMany({
    where: { role: "faculty", email: { in: facultyData.map((f) => f.email) } },
    select: { id: true, email: true },
  });
  const facultyByEmail = new Map(facultyUsers.map((f) => [f.email, f.id]));

  const programCourse = await prisma.course.upsert({
    where: { code: "BTECH-CS-S6" },
    update: {},
    create: {
      code: "BTECH-CS-S6",
      name: "B.Tech Computer Science - Sem 6",
      department: "Computer Science",
      credits: 24,
      semester: 6,
      totalClasses: 0,
    },
  });

  const subjectData = [
    {
      code: "CS601",
      name: "Automata Theory and Compiler Construction (ATCC)",
      credits: 4,
      type: "Theory",
      facultyEmail: "dixita.kagathara@darshan.ac.in",
    },
    {
      code: "CS602",
      name: "Operating Systems (OS)",
      credits: 4,
      type: "Theory",
      facultyEmail: "firoz.sherasiya@darshan.ac.in",
    },
    {
      code: "CS603",
      name: "Fundamentals of Accounting (FOA)",
      credits: 4,
      type: "Theory",
      facultyEmail: "javed.nathani@darshan.ac.in",
    },
    {
      code: "CS606",
      name: "Advanced Web Technologies (AWT)",
      credits: 3,
      type: "Theory",
      facultyEmail: "arjun.bala@darshan.ac.in",
    },
    {
      code: "CS607",
      name: "Information Network Security (INS)",
      credits: 3,
      type: "Theory",
      facultyEmail: "maulik.trivedi@darshan.ac.in",
    },
    {
      code: "CS608",
      name: "UI/UX Designing",
      credits: 3,
      type: "Theory",
      facultyEmail: "mayur.padia@darshan.ac.in",
    },
    {
      code: "CS609",
      name: ".NET",
      credits: 3,
      type: "Theory",
      facultyEmail: "naimish.vadodariya@darshan.ac.in",
    },
    {
      code: "CS610",
      name: "Advanced .NET",
      credits: 3,
      type: "Theory",
      facultyEmail: "naimish.vadodariya@darshan.ac.in",
    },
    {
      code: "CS611",
      name: "Advanced Advanced .NET",
      credits: 3,
      type: "Theory",
      facultyEmail: "naimish.vadodariya@darshan.ac.in",
    },
    {
      code: "CS612",
      name: "Flutter",
      credits: 3,
      type: "Theory",
      facultyEmail: "mehul.bhundiya@darshan.ac.in",
    },
    {
      code: "CS613",
      name: "Advanced Flutter",
      credits: 3,
      type: "Theory",
      facultyEmail: "mehul.bhundiya@darshan.ac.in",
    },
    {
      code: "CS604",
      name: "Machine Learning and Deep Learning (MLDL)",
      credits: 3,
      type: "Theory",
      facultyEmail: "jayesh.vagadiya@darshan.ac.in",
    },
    {
      code: "CS605",
      name: "Machine Learning (ML)",
      credits: 3,
      type: "Theory",
      facultyEmail: "jayesh.vagadiya@darshan.ac.in",
    },
  ];

  await Promise.all(
    subjectData.map((s) =>
      prisma.subject.upsert({
        where: { name_courseId: { name: s.name, courseId: programCourse.id } },
        update: {
          code: s.code,
          type: s.type,
          credits: s.credits,
          totalClasses: 40,
          facultyId: facultyByEmail.get(s.facultyEmail),
        },
        create: {
          name: s.name,
          code: s.code,
          type: s.type,
          courseId: programCourse.id,
          credits: s.credits,
          totalClasses: 40,
          facultyId: facultyByEmail.get(s.facultyEmail),
        },
      }),
    ),
  );

  const subjects = await prisma.subject.findMany({
    where: { courseId: programCourse.id },
    select: { id: true, name: true },
  });
  const subjectByName = new Map(subjects.map((s) => [s.name, s]));

  const parsedStudents = (studentsData as StudentRow[]).map((row) => {
    const [
      ,
      enrollmentNumber,
      batch,
      rollNumber,
      fullName,
      elective1,
      elective2,
    ] = row;
    const email = `${enrollmentNumber}@darshan.ac.in`;
    return {
      enrollmentNumber,
      email,
      rollNumber,
      batch,
      fullName,
      elective1,
      elective2,
    };
  });

  const existingUsers = await prisma.users.findMany({
    where: {
      role: "student",
      email: { in: parsedStudents.map((s) => s.email) },
    },
    select: { id: true, email: true },
  });
  const existingUserEmails = new Set(existingUsers.map((u) => u.email));

  const usersToCreate = parsedStudents
    .filter((s) => !existingUserEmails.has(s.email))
    .map((s) => ({
      username: s.enrollmentNumber,
      email: s.email,
      passwordHash: studentHash,
      role: "student" as const,
      status: "active",
    }));

  for (const userChunk of chunk(usersToCreate, 200)) {
    if (userChunk.length === 0) continue;
    await prisma.users.createMany({ data: userChunk, skipDuplicates: true });
  }

  const allStudentUsers = await prisma.users.findMany({
    where: {
      role: "student",
      email: { in: parsedStudents.map((s) => s.email) },
    },
    select: { id: true, email: true },
  });
  const userByEmail = new Map(allStudentUsers.map((u) => [u.email, u.id]));

  const existingProfiles = await prisma.studentProfile.findMany({
    where: {
      enrollmentNumber: { in: parsedStudents.map((s) => s.enrollmentNumber) },
    },
    select: { enrollmentNumber: true },
  });
  const existingEnrollmentProfiles = new Set(
    existingProfiles.map((p) => p.enrollmentNumber),
  );

  const profilesToCreate = parsedStudents
    .filter((s) => !existingEnrollmentProfiles.has(s.enrollmentNumber))
    .map((s) => ({
      userId: userByEmail.get(s.email)!,
      fullName: s.fullName,
      enrollmentNumber: s.enrollmentNumber,
      rollNumber: s.rollNumber,
      department: "Computer Science",
      batch: s.batch,
      currentSemester: 6,
      parentPhone: deterministicParentPhone(s.enrollmentNumber),
      parentEmail: `parent.${s.enrollmentNumber}@darshan.ac.in`,
    }));

  for (const profileChunk of chunk(profilesToCreate, 200)) {
    if (profileChunk.length === 0) continue;
    await prisma.studentProfile.createMany({
      data: profileChunk,
      skipDuplicates: true,
    });
  }

  const coreSubjects = [
    subjectByName.get("Automata Theory and Compiler Construction (ATCC)"),
    subjectByName.get("Operating Systems (OS)"),
    subjectByName.get("Fundamentals of Accounting (FOA)"),
  ].filter(Boolean) as SeedSubject[];

  const relationUpdates = parsedStudents.map((student) => {
    const userId = userByEmail.get(student.email);
    if (!userId) return null;

    const subjectIds = new Set<number>(coreSubjects.map((s) => s.id));
    for (const elective of [student.elective1, student.elective2]) {
      const mapped = normalizeElective(elective);
      if (!mapped) continue;
      const subject = subjectByName.get(mapped);
      if (subject) subjectIds.add(subject.id);
    }

    return prisma.users.update({
      where: { id: userId },
      data: {
        passwordHash: studentHash,
        status: "active",
        studentCourses: { set: [{ id: programCourse.id }] },
        studentSubjects: {
          set: Array.from(subjectIds).map((id) => ({ id })),
        },
        studentProfile: {
          upsert: {
            update: {
              fullName: student.fullName,
              rollNumber: student.rollNumber,
              department: "Computer Science",
              batch: student.batch,
              currentSemester: 6,
              parentPhone: deterministicParentPhone(student.enrollmentNumber),
              parentEmail: `parent.${student.enrollmentNumber}@darshan.ac.in`,
            },
            create: {
              fullName: student.fullName,
              enrollmentNumber: student.enrollmentNumber,
              rollNumber: student.rollNumber,
              department: "Computer Science",
              batch: student.batch,
              currentSemester: 6,
              parentPhone: deterministicParentPhone(student.enrollmentNumber),
              parentEmail: `parent.${student.enrollmentNumber}@darshan.ac.in`,
            },
          },
        },
      },
    });
  });

  const validUpdates = relationUpdates.filter(Boolean) as ReturnType<
    typeof prisma.users.update
  >[];

  let processed = 0;
  for (const updateChunk of chunk(validUpdates, 40)) {
    await Promise.all(updateChunk);
    processed += updateChunk.length;
    process.stdout.write(
      `⚡ Optimized progress: ${processed}/${validUpdates.length} students synchronized...\r`,
    );
  }
  process.stdout.write("\n");

  console.log("✅ Optimized seed complete.");
  console.log(`⏱️ Total time: ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
