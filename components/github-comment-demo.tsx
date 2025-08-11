import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { XCircle, CheckCircle2, Smile, MoreHorizontal } from "lucide-react";

export function GithubCommentDemo() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Avatar className="hidden md:flex bg-gray-100 dark:bg-gray-800">
          <AvatarImage alt="@slavingia" />
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
                  48 minutes ago
                </span>
                <Badge variant="outline">Member</Badge>
                <Badge variant="secondary">Author</Badge>
              </div>
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
        <Avatar className="hidden md:flex bg-gray-100 dark:bg-gray-800">
          <AvatarImage alt="@jacquez-bot" />
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
                  47 minutes ago
                </span>
              </div>
            </div>
            <div className="p-4 text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                This comment uses multiple question marks, which goes against our communication guidelines.
              </p>
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 text-gray-600 dark:text-gray-400 italic">
                Use professional English in all communication with no excessive
                capitalization, question marks, or informal language
              </blockquote>
              <p>
                Please rephrase using standard punctuation: "I'd like to try this again."
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
  );
}
