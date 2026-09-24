import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "daily email sync",
  { hourUTC: 0, minuteUTC: 0 },
  internal.gmailSync.runSyncForAllUsers,
);

export default crons;
