'use client';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AuthButton() {
  const { user, loading, login, logout, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Button disabled size="sm" variant="outline">
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
          <AvatarFallback>
            {(user.name || user.login).substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{user.name || user.login}</span>
        <Button size="sm" variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={login} className="bg-black text-white hover:bg-black/90">
      <Github className="h-4 w-4 mr-2" />
      Sign in with GitHub
    </Button>
  );
}