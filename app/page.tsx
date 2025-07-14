import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { GithubCommentDemo } from "@/components/github-comment-demo";

export default function JacquezLandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1 flex items-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Jacquez
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A friendly moderator for open-source communities. Jacquez
                  helps keep your GitHub discussions and issues welcoming,
                  respectful, and on-topic, so you can focus on building great
                  software.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link
                    href="https://github.com/apps/jacquez"
                    target="_blank"
                    prefetch={false}
                  >
                    <Github className="mr-2 h-5 w-5" /> Add to GitHub
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <GithubCommentDemo />
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full border-t">
        <div className="container flex h-16 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            An open-source project by{" "}
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
