import { getInitials, getAvatarColor, cn } from "@/lib/utils";

const SIZE = { sm: "w-8 h-8 text-[10px]", md: "w-10 h-10 text-xs", lg: "w-14 h-14 text-base" };

export function Avatar({ name, size = "md", className }) {
  return (
    <div className={cn("rounded-full bg-gradient-to-br flex items-center justify-center font-extrabold text-ink-900 flex-shrink-0", getAvatarColor(name), SIZE[size], className)}>
      {getInitials(name)}
    </div>
  );
}