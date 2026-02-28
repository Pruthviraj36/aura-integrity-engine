require('dotenv').config();
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../generated/prisma/client");

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 1,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🧹 Cleaning up student records...");

    // 1. Delete StudentProfiles
    const profileCount = await prisma.studentProfile.deleteMany({
        where: {
            user: { role: 'student' }
        }
    });
    console.log(`Deleted ${profileCount.count} student profiles.`);

    // 2. Delete Student Users
    // This will also clean up many-to-many relations if configured to cascade,
    // or we might need to disconnect first. 
    // Usually prisma handle relation cleanup for we if we use deleteMany
    const userCount = await prisma.users.deleteMany({
        where: { role: 'student' }
    });
    console.log(`Deleted ${userCount.count} student users.`);

    console.log("✨ Cleanup finished!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
