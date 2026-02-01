const { execSync } = require("child_process");
const path = require("path");

const services = [
  { name: "auth", path: "services/auth/src/seed.js" },
  { name: "products", path: "services/products/src/seed.js" },
  { name: "orders", path: "services/orders/src/seed.js" },
];

// Go up one level from scripts/ to project root
const rootDir = path.resolve(__dirname, "..");

console.log("🌱 Starting database seeding...\n");

const runSeed = async () => {
  for (const service of services) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`Seeding ${service.name} service...`);
    console.log("=".repeat(50));

    try {
      const seedPath = path.join(rootDir, service.path);
      execSync(`node ${seedPath}`, {
        stdio: "inherit",
        cwd: rootDir,
      });
    } catch (error) {
      console.error(`\nError seeding ${service.name}:`, error.message);
      process.exit(1);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log("All services seeded successfully!");
  console.log("=".repeat(50));
  console.log("\nTest credentials:");
  console.log("  Admin: admin@curate.com / Admin@123456");
  console.log("  Demo:  demo@curate.com / Demo@123456");
};

runSeed();
