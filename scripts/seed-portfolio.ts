import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const force = process.argv.includes("--force");

async function main() {
  const { seedPortfolioData } = await import("../app/lib/portfolioStore");
  const result = await seedPortfolioData(force);

  if (result === "seeded") {
    console.log("Portfolio data seeded to MongoDB.");
  } else if (result === "updated") {
    console.log("Portfolio data updated in MongoDB (--force).");
  } else {
    console.log("Portfolio data already exists in MongoDB. Use --force to overwrite.");
  }
}

main().catch((error) => {
  console.error("Failed to seed portfolio data:", error);
  process.exit(1);
});
