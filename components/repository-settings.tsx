"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
  };
}

interface Installation {
  id: number;
  account: {
    login: string;
    id: number;
    type: string;
  };
  settingsUrl: string;
}

export function RepositorySettings() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reposResponse, installationsResponse] = await Promise.all([
        fetch("/api/repositories"),
        fetch("/api/installations"),
      ]);

      const reposData = await reposResponse.json();
      const installationsData = await installationsResponse.json();

      if (!reposResponse.ok) {
        throw new Error(reposData.error || "Failed to fetch repositories");
      }

      if (!installationsResponse.ok) {
        throw new Error(
          installationsData.error || "Failed to fetch installations"
        );
      }

      setRepositories(reposData.repositories || []);
      setInstallations(installationsData.installations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getInstallationUrl = () => {
    if (installations.length === 1) {
      return installations[0].settingsUrl;
    }
    return "https://github.com/settings/installations";
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="h-7 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="text-sm text-destructive">Error: {error}</div>
        </div>
      </Card>
    );
  }

  if (repositories.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No repositories found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Install the Jacquez GitHub App on repositories where you want
            Jacquez to help with your PRs.
          </p>
          <Button asChild>
            <a
              href={getInstallationUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Manage GitHub App Installations
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Repository settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage which repositories Jacquez has access to through your{" "}
            <a
              href={getInstallationUrl()}
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              GitHub App installations
            </a>
            .
          </p>
        </div>

        <div className="space-y-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{repo.name}</span>
                    {repo.private && (
                      <Badge variant="outline" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {repo.owner.login}/{repo.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Badge variant="secondary" className="text-xs">
                  Installed
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
