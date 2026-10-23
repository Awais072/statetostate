const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || "";

if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
  console.log("PostgreSQL database detected. Synchronizing schema and seeding state news...");
  try {
    execSync("npx prisma db push", { stdio: "inherit" });
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  } catch (error) {
    console.error("Database sync warning:", error.message);
  }
} else {
  console.log("Local build mode. Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
}

console.log("Building Next.js production bundle...");
execSync("npx next build", { stdio: "inherit" });
