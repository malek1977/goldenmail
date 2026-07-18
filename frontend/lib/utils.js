// Utility functions
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...args) => twMerge(clsx(args));

export const formatNumber = (n, locale = "ar-SA") =>
  new Intl.NumberFormat(locale).format(n);

export const formatCurrency = (n, locale = "ar-SA") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(n);

export const formatDate = (date, locale = "ar-SA") => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(d);
};

export const formatDateTime = (date, locale = "ar-SA") => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
};

export const timeAgo = (date, locale = "ar") => {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const intervals = [[60, "second"], [3600, "minute"], [86400, "hour"], [604800, "day"], [2592000, "week"], [31536000, "month"]];
  for (let i = intervals.length - 1; i >= 0; i--) {
    const [div, unit] = intervals[i];
    if (seconds >= div) return rtf.format(-Math.floor(seconds / div), unit);
  }
  return rtf.format(-seconds, "second");
};

export const getInitials = (name) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const AVATAR_COLORS = [
  "from-gold-600 to-gold-300", "from-blue-600 to-blue-300",
  "from-purple-600 to-purple-300", "from-pink-600 to-pink-300", "from-emerald-600 to-emerald-300",
];
export const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const STATUS_MAP = {
  new: { label: "جديد", class: "badge-info" },
  pending: { label: "قيد الانتظار", class: "badge-warning" },
  in_progress: { label: "قيد التنفيذ", class: "badge-info" },
  in_design: { label: "قيد التصميم", class: "badge-info" },
  review: { label: "قيد المراجعة", class: "badge-warning" },
  planning: { label: "تخطيط", class: "badge-neutral" },
  completed: { label: "مكتمل", class: "badge-success" },
  on_hold: { label: "متوقف", class: "badge-warning" },
  delivered: { label: "مُسلَّم", class: "badge-success" },
  approved: { label: "معتمد", class: "badge-success" },
  responded: { label: "تم الرد", class: "badge-success" },
  closed: { label: "مغلق", class: "badge-neutral" },
  active: { label: "نشط", class: "badge-success" },
  inactive: { label: "غير نشط", class: "badge-neutral" },
  draft: { label: "مسودة", class: "badge-neutral" },
  published: { label: "منشور", class: "badge-success" },
  archived: { label: "مؤرشف", class: "badge-neutral" },
  lead: { label: "عميل محتمل", class: "badge-info" },
  prospect: { label: "محتمل", class: "badge-warning" },
  past: { label: "سابق", class: "badge-neutral" },
  rejected: { label: "مرفوض", class: "badge-danger" },
  out_of_stock: { label: "نفد المخزون", class: "badge-danger" },
};
export const getStatusBadge = (s) => STATUS_MAP[s] || { label: s, class: "badge-neutral" };

export const getPriorityBadge = (p) =>
  ({ low: { label: "منخفضة", class: "badge-neutral" }, medium: { label: "متوسطة", class: "badge-info" }, high: { label: "عالية", class: "badge-danger" } }[p]) || { label: p, class: "badge-neutral" };