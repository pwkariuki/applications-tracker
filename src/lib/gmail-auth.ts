const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const STATE_KEY = "gmail_oauth_state";

export function getGmailAuthUrl(): string {
  // CSRF guard: mint a nonce, stash it for this tab, verify it in the callback.
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/gmail/callback`,
    response_type: "code",
    scope: `${GMAIL_SCOPE} email`,
    access_type: "offline", // gets us a refresh token
    prompt: "consent", // force consent so refresh token is always returned
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Read and clear the nonce set by getGmailAuthUrl(). Returns null if there
// isn't one (e.g. the callback was opened directly).
export function consumeGmailOAuthState(): string | null {
  const state = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return state;
}
