import { NextRequest, NextResponse } from 'next/server';

interface GitHubInstallation {
  id: number;
  account: {
    login: string;
    id: number;
    type: string;
  };
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
  };
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
}

export async function GET(request: NextRequest) {
  const accessTokenCookie = request.cookies.get('github_access_token');
  
  if (!accessTokenCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const accessToken = accessTokenCookie.value;
    
    const installationsResponse = await fetch('https://api.github.com/user/installations', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Jacquez-App'
      }
    });

    if (!installationsResponse.ok) {
      throw new Error(`GitHub API error: ${installationsResponse.status}`);
    }

    const installationsData = await installationsResponse.json();
    const installations: GitHubInstallation[] = installationsData.installations || [];

    const allRepositories: GitHubRepository[] = [];

    for (const installation of installations) {
      const reposResponse = await fetch(
        `https://api.github.com/user/installations/${installation.id}/repositories`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Jacquez-App'
          }
        }
      );

      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        const repos: GitHubRepository[] = reposData.repositories || [];
        
        const pushAccessRepos = repos.filter(repo => 
          repo.permissions && repo.permissions.push
        );
        
        allRepositories.push(...pushAccessRepos);
      }
    }

    return NextResponse.json({ repositories: allRepositories });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' }, 
      { status: 500 }
    );
  }
}
