import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { XCircle, CheckCircle2, Smile, MoreHorizontal } from "lucide-react";

export function GithubCommentDemo() {
  return (
    <Card className="w-full max-w-none md:max-w-3xl mx-auto shadow-lg rounded-none md:rounded-lg border-x-0 md:border-x">
      <div className="px-4 space-y-4">
        <div className="flex gap-3">
          <Avatar className="bg-gray-100 dark:bg-gray-800">
            <AvatarImage
              src="/placeholder.svg?width=40&height=40"
              alt="@slavingia"
            />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
              <div className="px-4 py-2 border-b border-blue-200 dark:border-blue-800/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    slavingia
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    commented 48 minutes ago
                  </span>
                  <Badge variant="outline">Member</Badge>
                  <Badge variant="secondary">Author</Badge>
                </div>
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </div>
              <div className="p-4 text-gray-800 dark:text-gray-200">
                <p>one more time ??</p>
                <div className="mt-2">
                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Smile className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jacquez Bot Comment */}
        <div className="flex gap-3">
          <Avatar className="bg-gray-100 dark:bg-gray-800">
            <AvatarImage
              src="/placeholder.svg?width=40&height=40"
              alt="@jacquez-bot"
            />
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    jacquez-bot
                  </span>
                  <Badge
                    variant="default"
                    className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    bot
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    commented 47 minutes ago
                  </span>
                </div>
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </div>
              <div className="p-4 text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Hi there! Thanks for your interest in contributing to Flexile.
                </p>
                <p>
                  I noticed this comment doesn't follow our communication
                  guidelines. Specifically:
                </p>
                <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 text-gray-600 dark:text-gray-400 italic">
                  Use professional English in all communication with no
                  excessive capitalization, question marks, or informal language
                </blockquote>
                <p>
                  The comment "one more time ??" uses multiple question marks
                  and informal language. As our guidelines note, this makes
                  async communication more difficult.
                </p>
                <div>
                  <p>
                    Here's an example of how to rephrase this professionally:
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="line-through text-gray-500">
                        "one more time ??"
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>"I'd like to try this again."</span>
                    </div>
                  </div>
                </div>
                <p>
                  Could you please update your comment to use professional
                  language? This helps keep discussions clear and productive for
                  all contributors.
                </p>
                <p>
                  Let me know if you have any questions! We're happy to help you
                  get started contributing.
                </p>
                <div className="mt-2">
                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Smile className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
