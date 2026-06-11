import type { RbiColor } from "@/lib/rbi-information-data";

export const rbiColorStyles: Record<
  RbiColor,
  {
    icon: string;
    iconSoft: string;
    ring: string;
    button: string;
  }
> = {
  blue: {
    icon: "bg-blue-600 text-white",
    iconSoft: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
    ring: "ring-blue-100 dark:ring-blue-500/20",
    button: "text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
  },
  red: {
    icon: "bg-red-600 text-white",
    iconSoft: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200",
    ring: "ring-red-100 dark:ring-red-500/20",
    button: "text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
  },
  orange: {
    icon: "bg-orange-500 text-white",
    iconSoft: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-200",
    ring: "ring-orange-100 dark:ring-orange-500/20",
    button: "text-orange-700 hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-200"
  },
  purple: {
    icon: "bg-violet-600 text-white",
    iconSoft: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200",
    ring: "ring-violet-100 dark:ring-violet-500/20",
    button: "text-violet-700 hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
  },
  green: {
    icon: "bg-green-600 text-white",
    iconSoft: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-200",
    ring: "ring-green-100 dark:ring-green-500/20",
    button: "text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200"
  }
};
