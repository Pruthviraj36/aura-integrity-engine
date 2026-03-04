require('dotenv').config();
const prisma = require('../prisma/index');
const studentsData = require('../extracted_students.json');

const FACULTY_MAPPING = {
    "Dixita Kagathara": "dixita_kagathara",
    "Firoz Sherasiya": "firoz_sherasiya",
    "Javed Nathani": "javed_nathani",
    "Jayesh Vagadiya": "jayesh_vagadiya",
    "Arjun Bala": "arjun_bala",
    "Maulik Trivedi": "maulik_trivedi",
    "Mayur Padia": "mayur_padia",
    "Naimish Vadodariya": "naimish_vadodariya",
    "Mehul Bhundiya": "mehul_bhundiya"
};

const SUBJECT_FACULTY_MAP = {
    "Automata Theory and Compiler Construction (ATCC)": "Dixita Kagathara",
    "Operating Systems (OS)": "Firoz Sherasiya",
    "Fundamentals of Accounting (FOA)": "Javed Nathani",
    "Machine Learning and Deep Learning (MLDL)": "Jayesh Vagadiya",
    "Machine Learning (ML)": "Jayesh Vagadiya",
    "Advanced Web Technologies (AWT)": "Arjun Bala",
    "Information Network Security (INS)": "Maulik Trivedi",
    "UI/UX Designing": "Mayur Padia",
    ".NET": "Naimish Vadodariya",
    "Advanced .NET": "Naimish Vadodariya",
    "Advanced Advanced .NET": "Naimish Vadodariya",
    "Flutter": "Mehul Bhundiya",
    "Advanced Flutter": "Mehul Bhundiya",
    "Mobile Computing and Wireless Communication (MCWC)": "Jayesh Vagadiya" // Assigning to Jayesh Vagadiya as a fallback if not specified, or I can add a placeholder
};

const CORE_SUBJECTS = [
    "Automata Theory and Compiler Construction (ATCC)",
    "Operating Systems (OS)",
    "Fundamentals of Accounting (FOA)"
];

const ELECTIVE_MAPPING = {
    "web technology": "Advanced Web Technologies (AWT)",
    "awt": "Advanced Web Technologies (AWT)",
    "ins": "Information Network Security (INS)",
    "information network security": "Information Network Security (INS)",
    "ui/ux": "UI/UX Designing",
    "designing": "UI/UX Designing",
    "advanced .net development": "Advanced Advanced .NET",
    "modern architectures": "Advanced Advanced .NET",
    "advanced .net": "Advanced .NET",
    "restful apis": "Advanced .NET",
    "asp. net core": ".NET",
    "asp.net core": ".NET",
    ".net": ".NET",
    "advanced flutter": "Advanced Flutter",
    "flutter": "Flutter",
    "machine learning and deep learning": "Machine Learning and Deep Learning (MLDL)",
    "mldl": "Machine Learning and Deep Learning (MLDL)",
    "machine learning": "Machine Learning (ML)",
    "ml": "Machine Learning (ML)",
    "mcwc": "Mobile Computing and Wireless Communication (MCWC)",
    "mobile computing": "Mobile Computing and Wireless Communication (MCWC)"
};

async function sync() {
    console.log('--- ACADEMIC DATA SYNC START ---');

    // 1. Ensure Course exists
    const course = await prisma.course.upsert({
        where: { code: "BTECH-CS-S6" },
        update: {},
        create: {
            code: "BTECH-CS-S6",
            name: "B.Tech Computer Science - Sem 6",
            department: "Computer Science",
            credits: 24,
            semester: 6,
        }
    });
    console.log(`Course ${course.code} ready.`);

    // 2. Sync Subjects and Faculty
    const subjectCache = {};
    const subjectsToCreate = [
        ...CORE_SUBJECTS,
        "Advanced Web Technologies (AWT)",
        "Information Network Security (INS)",
        "UI/UX Designing",
        ".NET",
        "Advanced .NET",
        "Advanced Advanced .NET",
        "Flutter",
        "Advanced Flutter",
        "Machine Learning and Deep Learning (MLDL)",
        "Machine Learning (ML)",
        "Mobile Computing and Wireless Communication (MCWC)"
    ];

    for (const subName of subjectsToCreate) {
        const facultyName = SUBJECT_FACULTY_MAP[subName] || "Jayesh Vagadiya";
        const facultyUsername = FACULTY_MAPPING[facultyName];
        const faculty = await prisma.users.findUnique({ where: { username: facultyUsername } });

        if (!faculty) {
            console.warn(`Warning: Faculty ${facultyUsername} not found for subject ${subName}`);
        }

        const subject = await prisma.subject.upsert({
            where: { name_courseId: { name: subName, courseId: course.id } },
            update: {
                facultyId: faculty ? faculty.id : null
            },
            create: {
                name: subName,
                courseId: course.id,
                credits: 3,
                type: "Theory",
                facultyId: faculty ? faculty.id : null
            }
        });
        subjectCache[subName] = subject.id;
        console.log(`Subject "${subName}" (ID: ${subject.id}) linked to ${facultyUsername || 'Nobody'}`);
    }

    // 3. Sync Students
    console.log(`Processing ${studentsData.length} students...`);

    let processed = 0;
    for (const entry of studentsData) {
        const [id, enroll, class_, rollno, name, e1, e2] = entry;

        const student = await prisma.users.findUnique({ where: { username: enroll } });
        if (!student) {
            console.warn(`Student ${enroll} (${name}) not found in database. Skipping.`);
            continue;
        }

        const assignedSubjectIds = [];

        // Add Core Subjects
        for (const core of CORE_SUBJECTS) {
            if (subjectCache[core]) assignedSubjectIds.push({ id: subjectCache[core] });
        }

        // Helper to map elective name
        const mapElective = (text) => {
            if (!text || text === "Not Given") return null;
            const normalized = text.toLowerCase();
            for (const [key, value] of Object.entries(ELECTIVE_MAPPING)) {
                if (normalized.includes(key)) return value;
            }
            return null;
        };

        const elective1Name = mapElective(e1);
        const elective2Name = mapElective(e2);

        if (elective1Name && subjectCache[elective1Name]) {
            assignedSubjectIds.push({ id: subjectCache[elective1Name] });
        }
        if (elective2Name && subjectCache[elective2Name]) {
            assignedSubjectIds.push({ id: subjectCache[elective2Name] });
        }

        // Unique subjects only
        const uniqueSubjectIds = Array.from(new Set(assignedSubjectIds.map(s => s.id))).map(id => ({ id }));

        await prisma.users.update({
            where: { id: student.id },
            data: {
                studentCourses: { connect: [{ id: course.id }] },
                studentSubjects: {
                    set: [], // Clear existing
                    connect: uniqueSubjectIds
                }
            }
        });

        processed++;
        if (processed % 50 === 0) {
            console.log(`Progress: ${processed}/${studentsData.length} students updated...`);
        }
    }

    console.log(`--- SYNC COMPLETE: ${processed} students updated ---`);
}

sync()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
