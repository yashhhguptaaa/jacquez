import { NextRequest, NextResponse } from "next/server";

interface GitHubInstallation {
  id: number;
  account: {
    login: string;
    id: number;
    type: string;
  };
}

export async function GET(request: NextRequest) {
  const accessTokenCookie = request.cookies.get("github_access_token");

  if (!accessTokenCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const accessToken = accessTokenCookie.value;

    const installationsResponse = await fetch(
      "https://api.github.com/user/installations",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Jacquez-App",
        },
      }
    );

    if (!installationsResponse.ok) {
      throw new Error(`GitHub API error: ${installationsResponse.status}`);
    }

    const installationsData = await installationsResponse.json();
    const installations: GitHubInstallation[] =
      installationsData.installations || [];

    const installationDetails = installations.map((installation) => ({
      id: installation.id,
      account: installation.account,
      settingsUrl:
        installation.account.type === "Organization"
          ? `https://github.com/organizations/${installation.account.login}/settings/installations/${installation.id}`
          : `https://github.com/settings/installations/${installation.id}`,
    }));

    return NextResponse.json({ installations: installationDetails });
  } catch (error) {
    console.error("Error fetching installations:", error);
    return NextResponse.json(
      { error: "Failed to fetch installations" },
      { status: 500 }
    );
  }
}
