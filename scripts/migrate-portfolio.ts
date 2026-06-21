import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const { migratePortfolioData } = await import("../app/lib/portfolioStore");
  const data = await migratePortfolioData();

  console.log("Portfolio data migrated and saved to MongoDB.");
  console.log(
    `Projects: ${data.projects.length}, Experience: ${data.experiences.length}, Education: ${data.education.length}, Certifications: ${data.certifications.length}, Skills: ${data.skills.length}`
  );
}

main().catch((error) => {
  console.error("Failed to migrate portfolio data:", error);
  process.exit(1);
});
