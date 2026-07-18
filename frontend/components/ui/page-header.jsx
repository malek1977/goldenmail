import { cn } from "@/lib/utils";

export function PageHeader({ title, description, breadcrumbs, actions, className }) {
  return (
    <div className={cn("mb-6 sm:mb-8 space-y-3", className)}>
      {breadcrumbs?.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {b.href ? (
                <a href={b.href} className="hover:text-gold-300 transition-colors">{b.label}</a>
              ) : (
                <span className="text-gold-300 font-bold">{b.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">{title}</h1>
          {description && <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}