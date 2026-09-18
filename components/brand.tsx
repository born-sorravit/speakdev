import Link from "next/link";

import { cn } from "@/lib/utils";

/** Wordmark + logo. The mark is an inline SVG so it inherits the theme. */
export function Brand({
  className,
  href = "/",
  showTagline = false,
}: {
  className?: string;
  href?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-xl shadow-sm transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="size-5"
        >
          <path
            d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v13H6.5A2.5 2.5 0 0 0 4 19.5v-13Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19v3H6.5A2.5 2.5 0 0 1 4 19.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 9h5M9 12h3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-bold tracking-tight">
          SpeakDev
        </span>
        {showTagline && (
          <span className="text-muted-foreground mt-1 text-[0.6875rem] font-medium">
            English for Thai devs
          </span>
        )}
      </span>
    </Link>
  );
}
