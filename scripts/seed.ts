#!/usr/bin/env npx tsx
import { faker } from "@faker-js/faker";
import { spawnSync } from "child_process";

const APPLICATION_COUNT = 50;

const statuses = [
  "applied",
  "phone_screen",
  "technical",
  "onsite",
  "offer",
  "signed",
  "rejected",
  "withdrawn",
] as const;
const sources = [
  "Referral",
  "Careers page",
  "Wellfound",
  "GitHub list",
  "Email",
  "Handshake",
  "LinkedIn",
] as const;

const applications = Array.from({ length: APPLICATION_COUNT }, () => {
  const generatedRole = faker.hacker.noun();

  return {
    company: faker.company.name(),
    source: faker.helpers.arrayElement(sources),
    status: faker.helpers.arrayElement(statuses),
    role:
      generatedRole.charAt(0).toUpperCase() +
      generatedRole.slice(1) +
      " Engineer",
    notes: faker.lorem.paragraphs(),
    autoUpdated: faker.datatype.boolean(),
    lastUpdate: faker.date.between({
      from: "2026-01-01T00:00:00.000Z",
      to: Date.now(),
    }).getTime(),
  };
});

console.log(`Seeding ${applications.length} applications...`);

const result = spawnSync(
  "npx",
  ["convex", "run", "seed:insertSeedData", JSON.stringify({ applications })],
  {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  },
);

if (result.status !== 0) {
  console.error("Seed failed");
  console.error(result.stderr || result.stdout);
  process.exit(1);
}

console.log("Done!");
