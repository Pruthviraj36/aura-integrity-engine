require('dotenv').config();
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../generated/prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter, log: ["query", "error", "warn"] });

async function main() {
    console.log("🚀 Starting Mega Seed from extracted PDF data...");

    const dataPath = path.join(__dirname, "..", "extracted_students.json");
    if (!fs.existsSync(dataPath)) {
        throw new Error("Extracted data file not found! Run the extraction script first.");
    }

    const rawData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash("Aura@2026", saltRounds);

    // 1. Ensure Main Course Exists
    const mainCourse = await prisma.course.upsert({
        where: { code: "BTECH-CSE-2026" },
        update: {},
        create: {
            code: "BTECH-CSE-2026",
            name: "B.Tech Computer Science (Batch 2026)",
            department: "Computer Science",
            credits: 24,
            semester: 6,
            totalClasses: 0
        }
    });

    console.log(`✅ Main Course: ${mainCourse.name}`);

    let count = 0;
    const subjectsMap = new Map();

    for (const row of rawData) {
        if (!row || row.length < 5 || row[1] === "Enrollment No.") continue;

        const [sr, enrollment, bch, roll, name, elective4, elective3] = row;

        if (!enrollment || enrollment.trim() === "") continue;

        try {
            const electives = [elective4, elective3].filter(e => e && e.trim() !== "");
            const connectSubjects = [];

            for (const subjName of electives) {
                const cleanedName = subjName.replace(/\n/g, " ").trim();
                let subjId;

                if (subjectsMap.has(cleanedName)) {
                    subjId = subjectsMap.get(cleanedName);
                } else {
                    let subj = await prisma.subject.findFirst({
                        where: { name: cleanedName, courseId: mainCourse.id }
                    });

                    if (!subj) {
                        subj = await prisma.subject.create({
                            data: {
                                name: cleanedName,
                                courseId: mainCourse.id,
                                credits: 4,
                                totalClasses: 40
                            }
                        });
                    }
                    subjId = subj.id;
                    subjectsMap.set(cleanedName, subjId);
                }
                connectSubjects.push({ id: subjId });
            }

            // Create Student User
            await prisma.users.upsert({
                where: { username: enrollment.trim() },
                update: {
                    studentProfile: {
                        upsert: {
                            create: {
                                fullName: name.trim(),
                                rollNumber: roll ? roll.trim() : null,
                                batch: bch ? bch.trim() : null,
                                enrollmentNumber: enrollment.trim(),
                                department: "Computer Science",
                                currentSemester: 6
                            },
                            update: {
                                fullName: name.trim(),
                                rollNumber: roll ? roll.trim() : null,
                                batch: bch ? bch.trim() : null,
                                enrollmentNumber: enrollment.trim()
                            }
                        }
                    },
                    studentCourses: { connect: { id: mainCourse.id } },
                    studentSubjects: { connect: connectSubjects }
                },
                create: {
                    username: enrollment.trim(),
                    email: `${enrollment.trim()}@darshan.ac.in`,
                    passwordHash: defaultPassword,
                    role: "student",
                    status: "active",
                    studentProfile: {
                        create: {
                            fullName: name.trim(),
                            enrollmentNumber: enrollment.trim(),
                            rollNumber: roll ? roll.trim() : null,
                            department: "Computer Science",
                            batch: bch ? bch.trim() : null,
                            currentSemester: 6
                        }
                    },
                    studentCourses: { connect: { id: mainCourse.id } },
                    studentSubjects: { connect: connectSubjects }
                }
            });

            count++;
            if (count % 50 === 0) console.log(`Processed ${count} students...`);
        } catch (err) {
            console.error(`Error processing row ${sr}:`, err.message);
        }
    }

    console.log(`✨ Mega Seed Finished! Total students processed: ${count}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
