'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

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

interface RepositorySettingsState {
  [repoId: number]: boolean;
}

export function RepositorySettings() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<RepositorySettingsState>({});

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repositories');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch repositories');
      }
      
      setRepositories(data.repositories || []);
      
      const initialSettings: RepositorySettingsState = {};
      data.repositories?.forEach((repo: Repository) => {
        initialSettings[repo.id] = false;
      });
      setSettings(initialSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (repoId: number, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      [repoId]: enabled
    }));
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading repositories...</div>
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
          <p className="text-sm text-muted-foreground">
            Install the Jacquez GitHub App on repositories where you want Jacquez to help with your PRs.
          </p>
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
            Enable or disable Jacquez per repository from your installations list. 
            Jacquez runs only on PRs you author.
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
                      <Badge variant="secondary" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {repo.owner.login}/{repo.name}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {settings[repo.id] ? 'Enabled' : 'Disabled'}
                </span>
                <Switch
                  checked={settings[repo.id] || false}
                  onCheckedChange={(checked) => handleToggle(repo.id, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
