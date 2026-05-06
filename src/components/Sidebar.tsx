"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";
import useSWR from "swr";
import { MdMenu, MdClose, MdChevronLeft, MdChevronRight, MdDashboard, MdStorefront, MdAttachMoney, MdSettings, MdAdminPanelSettings, MdLogout } from 'react-icons/md';

type SidebarProps = {
  active?: string;
  admin?: boolean;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Falha ao carregar navegação.");
  }
  return res.json();
};

export function Sidebar({ active = "/dashboard", admin = false, collapsed, setCollapsed }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { data: appsData } = useSWR<{ apps: Array<{ slug: string; owned: boolean }> }>("/api/marketplace/apps", fetcher);

  const financeOwned = appsData?.apps?.some((app) => app.slug === "finance-app" && app.owned);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-6 left-6 z-50 rounded-xl bg-[var(--surface)] p-2.5 text-[var(--text)] shadow-lg ring-1 ring-[var(--border)]/30 transition-all hover:bg-[var(--surface-soft)] lg:hidden"
        aria-label="Abrir menu"
      >
        <MdMenu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 z-50 flex min-h-screen flex-col gap-6 border-r border-[var(--border)]/30 bg-[var(--surface)]/98 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 lg:rounded-r-2xl lg:border-r-2 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${collapsed ? "w-20" : "w-64"}`}>
      
      {/* Logo */}
      <div className={`flex items-center justify-between gap-2 ${collapsed ? 'flex-col justify-center p-2' : ''}`}>
        {!collapsed && (
          <div className="space-y-0.5">
            <p className="text-lg font-bold tracking-tight text-[var(--text)]">VEXYN</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">SaaS Platform</p>
          </div>
        )}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center rounded-xl bg-[var(--surface-soft)] p-2 text-[var(--text)] ring-1 ring-[var(--border)]/50 transition-all hover:bg-[var(--primary-soft)] lg:hidden"
            aria-label="Fechar menu"
          >
            <MdClose size={18} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden items-center justify-center rounded-xl bg-[var(--surface-soft)] p-2 text-[var(--text)] ring-1 ring-[var(--border)]/50 transition-all hover:bg-[var(--primary-soft)] lg:flex"
            aria-label="Alternar sidebar"
            title={collapsed ? "Expandir" : "Minimizar"}
          >
            {collapsed ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 pb-2 text-[9px] uppercase tracking-[0.15em] font-semibold text-[var(--muted)]">Navegação</p>
        )}
        <div className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              active === "/dashboard"
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                : "text-[var(--text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary)]"
            }`}
            title={collapsed ? "Dashboard" : undefined}
          >
            <MdDashboard size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">Dashboard</span>}
          </Link>
          <Link
            href="/marketplace"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              active === "/marketplace"
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                : "text-[var(--text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary)]"
            }`}
            title={collapsed ? "Marketplace" : undefined}
          >
            <MdStorefront size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">Marketplace</span>}
          </Link>
          <Link
            href="/finance"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              active === "/finance"
                ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                : "text-[var(--text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary)]"
            }`}
            title={collapsed ? "Financeiro" : undefined}
          >
            <MdAttachMoney size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">Financeiro</span>}
          </Link>
          {admin && (
            <Link
              href="/admin"
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active === "/admin"
                  ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                  : "text-[var(--text)] hover:bg-[var(--surface-soft)] hover:text-[var(--primary)]"
              }`}
              title={collapsed ? "Admin" : undefined}
            >
              <MdAdminPanelSettings size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">Admin</span>}
            </Link>
          )}
        </div>

        {!collapsed && financeOwned !== undefined && (
          <>
            <div className="my-2 h-px bg-[var(--border)]" />
            <p className="px-3 pb-2 text-[9px] uppercase tracking-[0.15em] font-semibold text-[var(--muted)]">Aplicativos</p>
            <div className="space-y-1">
              <Link
                href="/finance"
                className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                  active === "/finance"
                    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]"
                }`}
                title={collapsed ? "Financeiro" : undefined}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                  <MdAttachMoney size={14} />
                </div>
                <span className="truncate">Financeiro</span>
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* Footer Actions */}
      <div className="space-y-2 border-t border-[var(--border)]/30 pt-4">
        {!collapsed && (
          <p className="px-3 text-[9px] uppercase tracking-[0.15em] font-semibold text-[var(--muted)]">Conta</p>
        )}
        <div className="flex flex-col gap-1">
          <Link
            href="/settings"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
              active === "/settings"
                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]"
            }`}
            title={collapsed ? "Configurações" : undefined}
          >
            <MdSettings size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">Configurações</span>}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              isLoggingOut 
                ? "text-[var(--muted)]" 
                : "text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
            }`}
            title={collapsed ? "Sair" : undefined}
          >
            <MdLogout size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{isLoggingOut ? "Saindo..." : "Sair"}</span>}
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
