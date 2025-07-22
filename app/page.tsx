"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { GithubCommentDemo } from "@/components/github-comment-demo";
import { RepositorySettings } from "@/components/repository-settings";
import { useAuth } from "@/lib/auth";

export default function JacquezLandingPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none flex items-center gap-2">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 32 32"
                    fill="none"
                    aria-hidden="true"
                    className="inline-block"
                  >
                    <polygon points="4,28 28,28 28,4" fill="currentColor" />
                  </svg>
                  Jacquez
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A friendly moderator for OSS repos.
                  <br />
                  <br />
                  Jacquez helps keep your GitHub discussions and issues
                  welcoming, respectful, and on-topic, so you can focus on
                  building great software.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {!isAuthenticated && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-black text-white hover:bg-black/90"
                  >
                    <Link href="/api/auth/github" prefetch={false}>
                      <Github className="mr-2 h-5 w-5" /> Add to a GitHub
                      repository
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              {isAuthenticated ? <RepositorySettings /> : <GithubCommentDemo />}
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full">
        <div className="container mx-auto flex h-16 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            A soon-to-be open-source project by{" "}
            <Link
              href="https://antiwork.com"
              className="font-medium underline-offset-4 hover:underline"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              Antiwork
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
