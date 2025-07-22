import { NextRequest, NextResponse } from "next/server";

const GH_CLIENT_ID = process.env.GH_CLIENT_ID || "Ov23liJ0xVB8vtPP1apH";

export async function GET(request: NextRequest) {
  // Start OAuth flow - redirect to GitHub authorization
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", GH_CLIENT_ID);
  authUrl.searchParams.set(
    "redirect_uri",
    `${new URL(request.url).origin}/api/auth/callback`
  );
  authUrl.searchParams.set("scope", "user:email");
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7));

  return NextResponse.redirect(authUrl.toString());
}
