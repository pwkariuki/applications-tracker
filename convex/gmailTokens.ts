import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

// Read user's stored tokens
export const getTokens = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("gmailTokens")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Persist a refreshed access token with a new expiry
export const updateAccessToken = internalMutation({
  args: {
    tokenRowId: v.id("gmailTokens"),
    accessToken: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, { tokenRowId, accessToken, expiresAt }) => {
    await ctx.db.patch(tokenRowId, { accessToken, expiresAt });
  },
});

// Returns a valid access token for the user, refreshing if the current one
// has expired, or is about to expire. Called before any Gmail API request.
export const getValidAccessToken = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }): Promise<string> => {
    const tokens = await ctx.runQuery(internal.gmailTokens.getTokens, {
      userId,
    });
    if (!tokens) throw new Error("Gmail not connected for this user");

    // 60s buffer so we do not hand back a token that dies mid-request
    const stillValid = Date.now() < tokens.expiresAt - 60_000;
    if (stillValid) return tokens.accessToken;

    // Refresh access token with refresh token
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "applications/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: tokens.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(
        `Token refresh failed (may need to reconnect Gmail): ${detail}`,
      );
    }

    const refreshed = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };

    const newExpiresAt = Date.now() + refreshed.expires_in * 1000;
    await ctx.runMutation(internal.gmailTokens.updateAccessToken, {
      tokenRowId: tokens._id,
      accessToken: refreshed.access_token,
      expiresAt: newExpiresAt,
    });

    return refreshed.access_token;
  },
});
