import { getAuthUserId } from "@convex-dev/auth/server";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const exchangeGmailCode = action({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    // This connects the signed-in user's Gmail — bail before talking to
    // Google if there's no session.
    if ((await getAuthUserId(ctx)) === null) {
      throw new Error("Not authenticated");
    }

    // Trade the auth code for tokens.
    const redirectUri = `${process.env.SITE_URL}/auth/gmail/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const detail = await tokenRes.text();
      throw new Error(`Token exchange failed: ${detail}`);
    }

    const tokens = (await tokenRes.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    // Google only returns a refresh_token on first consent (or with
    // prompt=consent). If it's missing, the connect flow didn't force consent.
    if (!tokens.refresh_token) {
      throw new Error(
        "No refresh token returned — ensure the auth URL uses access_type=offline and prompt=consent.",
      );
    }

    // Fetch which Google account this is, for display.
    let email: string | undefined;
    try {
      const infoRes = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${tokens.access_token}` } },
      );
      if (infoRes.ok) {
        const info = (await infoRes.json()) as { email?: string };
        email = info.email;
      }
    } catch {
      // Non-fatal.
    }

    // Store the tokens (mutation does the DB write + auth check).
    await ctx.runMutation(internal.gmail.storeTokens, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      email,
    });

    return { connected: true };
  },
});
