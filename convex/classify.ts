import { z } from "zod";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const STATUS_ENUM = z.enum([
  "applied",
  "phone_screen",
  "technical",
  "onsite",
  "offer",
  "signed",
  "rejected",
  "withdrawn",
]);

const classificationSchema = z.object({
  isApplicationEmail: z.boolean().describe(
    `True only if this is about the recipient's own job application (interview invite, technical assessment, rejection, offer, next step).
      False for newsletters, job alerts, marketing, promotions and all other emails not related to a job application.
    `,
  ),
  company: z
    .string()
    .describe("The hiring company name, or empty string if unclear."),
  status: STATUS_ENUM.nullable().describe(
    "The application stage this email indicates, or null if not an application email.",
  ),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "Confidence (0-1) that this classification is correct. Be conservative.",
    ),
  reasoning: z.string().describe("1-2 sentences explaining the call."),
});

export const classifyEmail = action({
  args: {
    subject: v.string(),
    body: v.string(),
    from: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const { output } = await generateText({
      model: anthropic("claude-sonnet-5"),
      output: Output.object({ schema: classificationSchema }),
      prompt: `Classify this email for a job-application tracker.\n\n
      From: ${args.from ?? "unknown"}\n
      Subject: ${args.subject}\n
      ${args.body}
      `,
    });
    return output;
  },
});
