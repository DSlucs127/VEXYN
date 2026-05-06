import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  active?: string;
  admin?: boolean;
  actions?: ReactNode;
  impersonatorId?: string;
};

export function PageShell({ children, title, subtitle, actions, impersonatorId }: PageShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl bg-white/90 p-6 shadow-xl shadow-black/5">
          {title && <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>}
          {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
          {impersonatorId && <p className="mt-3 text-sm text-slate-500">Em personificação: {impersonatorId}</p>}
          {actions && <div className="mt-4">{actions}</div>}
        </div>
        {children}
      </div>
    </main>
  );
}
