import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
}) => {
  return (
    <div className="mb-6 pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-indigo-600 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-800">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span className="text-slate-300">/</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {description && <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">{description}</p>}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
};
