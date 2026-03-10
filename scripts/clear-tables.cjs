#!/usr/bin/env node
/**
 * clear-tables.cjs
 * Interactively clear one or more specific database tables.
 *
 * Usage:
 *   node scripts/clear-tables.cjs                  (interactive menu)
 *   node scripts/clear-tables.cjs Attendance Session
 */

require("dotenv").config({ path: "./backend/.env" });
const readline = require("readline");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./backend/generated/prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// ─── Table catalogue ────────────────────────────────────────────────────────
// Ordered so dependents come before their parents (safe delete order).
const TABLES = [
  { name: "AuditLog", prismaKey: "auditLog", safe: true },
  { name: "Notification", prismaKey: "notification", safe: true },
  { name: "Report", prismaKey: "report", safe: true },
  { name: "Grade", prismaKey: "grade", safe: true },
  { name: "LeaveApplication", prismaKey: "leaveApplication", safe: true },
  { name: "ExamPermit", prismaKey: "examPermit", safe: true },
  { name: "Attendance", prismaKey: "attendance", safe: true },
  { name: "QrCode", prismaKey: "qrCode", safe: true },
  { name: "Session", prismaKey: "session", safe: true },
  { name: "Timetable", prismaKey: "timetable", safe: true },
  { name: "Subject", prismaKey: "subject", safe: true },
  { name: "Course", prismaKey: "course", safe: true },
  { name: "StudentProfile", prismaKey: "studentProfile", safe: false },
  { name: "FacultyProfile", prismaKey: "facultyProfile", safe: false },
  { name: "AdminProfile", prismaKey: "adminProfile", safe: false },
  { name: "Users", prismaKey: "users", safe: false },
];

const NAMES = TABLES.map((t) => t.name);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function tableByName(name) {
  return TABLES.find((t) => t.name.toLowerCase() === name.toLowerCase());
}

async function clearTable(table) {
  const count = await prisma[table.prismaKey].count();
  await prisma[table.prismaKey].deleteMany({});
  console.log(`  ✓ ${table.name} — ${count} row(s) deleted`);
}

function printMenu() {
  console.log("\n┌─────────────────────────────────────────┐");
  console.log("│        Aura — Clear Specific Tables      │");
  console.log("└─────────────────────────────────────────┘");
  TABLES.forEach((t, i) => {
    const idx = String(i + 1).padStart(2, " ");
    const warn = t.safe ? "  " : " ⚠";
    console.log(`  ${idx}. ${t.name}${warn}`);
  });
  console.log(
    "\n  ⚠  = contains user / profile data — extra confirmation needed",
  );
  console.log("\n  Enter numbers separated by spaces/commas, e.g.  1 3 5");
  console.log("  Or type table names, e.g.  Attendance Session");
  console.log("  Type  all  to select every table");
  console.log("  Type  q    to quit\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // CLI args mode — skip interactive menu
  if (process.argv.length > 2) {
    const targets = process.argv
      .slice(2)
      .map((a) => tableByName(a))
      .filter(Boolean);
    const unknown = process.argv.slice(2).filter((a) => !tableByName(a));
    if (unknown.length) {
      console.error(`\n❌ Unknown table(s): ${unknown.join(", ")}`);
      console.error(`   Valid names: ${NAMES.join(", ")}`);
      rl.close();
      await prisma.$disconnect();
      process.exit(1);
    }
    const answer = await ask(
      rl,
      `\nAbout to delete all rows from: ${targets.map((t) => t.name).join(", ")}\nAre you sure? (yes/no): `,
    );
    rl.close();
    if (answer.trim().toLowerCase() !== "yes") {
      console.log("Aborted.");
    } else {
      console.log("");
      for (const t of targets) await clearTable(t);
      console.log("\n✅ Done.");
    }
    await prisma.$disconnect();
    return;
  }

  // Interactive mode
  printMenu();

  const raw = (await ask(rl, "Your selection: ")).trim();

  if (!raw || raw.toLowerCase() === "q") {
    console.log("Aborted.");
    rl.close();
    await prisma.$disconnect();
    return;
  }

  let targets;
  if (raw.toLowerCase() === "all") {
    targets = [...TABLES];
  } else {
    const tokens = raw.split(/[\s,]+/).filter(Boolean);
    targets = tokens.map((tok) => {
      // Allow numeric index or name
      const idx = parseInt(tok, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= TABLES.length)
        return TABLES[idx - 1];
      return tableByName(tok);
    });
    const invalid = tokens.filter((tok, i) => !targets[i]);
    if (invalid.length) {
      console.error(`\n❌ Unrecognised: ${invalid.join(", ")}`);
      rl.close();
      await prisma.$disconnect();
      return;
    }
    targets = targets.filter(Boolean);
  }

  if (!targets.length) {
    console.log("Nothing selected. Aborted.");
    rl.close();
    await prisma.$disconnect();
    return;
  }

  // Extra confirmation for unsafe tables
  const unsafe = targets.filter((t) => !t.safe);
  if (unsafe.length) {
    console.log(
      `\n⚠  WARNING: The following tables contain user/profile data:`,
    );
    unsafe.forEach((t) => console.log(`   • ${t.name}`));
    const confirm = await ask(
      rl,
      "Type DELETE to confirm you understand this is irreversible: ",
    );
    if (confirm.trim() !== "DELETE") {
      console.log("Aborted.");
      rl.close();
      await prisma.$disconnect();
      return;
    }
  } else {
    const confirm = await ask(
      rl,
      `\nAbout to clear: ${targets.map((t) => t.name).join(", ")}\nProceed? (yes/no): `,
    );
    if (confirm.trim().toLowerCase() !== "yes") {
      console.log("Aborted.");
      rl.close();
      await prisma.$disconnect();
      return;
    }
  }

  rl.close();
  console.log("\nClearing tables...\n");
  for (const t of targets) {
    try {
      await clearTable(t);
    } catch (err) {
      console.error(`  ✗ ${t.name} — failed: ${err.message}`);
    }
  }
  console.log("\n✅ Done.");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Fatal:", err);
  await prisma.$disconnect();
  process.exit(1);
});
