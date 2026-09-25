"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me/messages";

export type FetchedEmail = {
  id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
};

// Recursively walk the MIME tree to find readable body text.
// Prefers text/plain; falls back to stripped text/html.
type Part = {
  mimeType?: string;
  body?: { data?: string };
  parts?: Part[];
};

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64url").toString("utf-8");
}

function getHeader(
  headers: { name: string; value: string }[],
  name: string,
): string {
  return (
    headers.find((h) => h.name.toLowerCase() == name.toLowerCase())?.value ?? ""
  );
}

function extractBody(part: Part): string {
  // text/plain with data
  if (part.mimeType === "text/plain" && part.body?.data) {
    return decodeBase64Url(part.body.data);
  }
  // Recurse on children, prefer text/plain
  if (part.parts) {
    for (const child of part.parts) {
      const text = extractBody(child);
      if (text) return text;
    }
  }
  // Fallback on text/html with data if no text/plain
  if (part.mimeType === "text/html" && part.body?.data) {
    return stripHtml(decodeBase64Url(part.body.data));
  }
  return "";
}

export const fetchRecentEmails = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }): Promise<FetchedEmail[]> => {
    const token = await ctx.runMutation(
      internal.gmailTokens.getValidAccessToken,
      { userId },
    );

    const authHeader = { Authorization: `Bearer ${token}` };

    // List message IDs from the last 24 hours, skipping promotions/social noise.
    const query = encodeURIComponent(
      "newer_than:1d -category:promotions -category:social",
    );
    const listResult = await fetch(`${GMAIL_API}?q=${query}`, {
      headers: authHeader,
    });
    if (!listResult.ok) {
      throw new Error(`Gmail list failed: ${listResult.text()}`);
    }
    const listData = (await listResult.json()) as {
      messages?: { id: string }[];
    };
    const ids = listData.messages?.map((m) => m.id) ?? [];

    // Fetch each full message and extract the message fields
    const emails: FetchedEmail[] = [];
    for (const id of ids) {
      const messageResult = await fetch(`${GMAIL_API}/${id}?format=full`, {
        headers: authHeader,
      });

      if (!messageResult.ok) continue; // skip failed messages

      const message = (await messageResult.json()) as {
        id: string;
        payload: Part & { headers: { name: string; value: string }[] };
      };

      const headers = message.payload.headers ?? [];
      emails.push({
        id: message.id,
        subject: getHeader(headers, "Subject"),
        from: getHeader(headers, "From"),
        date: getHeader(headers, "Date"),
        body: extractBody(message.payload).slice(0, 4000), // capped for token cost
      });
    }

    return emails;
  },
});
