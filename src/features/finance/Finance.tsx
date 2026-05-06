"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageShell } from "@/components/PageShell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MdAdd, MdClose, MdCreditCard, MdList, MdPieChart, MdTrendingUp, MdTrendingDown, MdRepeat, MdTag, MdCalendarToday, MdAccountBalanceWallet, MdAttachMoney, MdKeyboardArrowDown } from 'react-icons/md';


// Types
type TransactionType = "INCOME" | "EXPENSE" | "DEBT";
type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category?: string;
  recurrence?: RecurrenceType;
  notes?: string;
}

type Session = {
  authenticated: boolean;
  session?: { role: string; impersonatorId?: string };
};

// Categories by type
const categoriesByType: Record<TransactionType, string[]> = {
  INCOME: ["Salário", "Freelance", "Investimentos", "Reembolso", "Outros"],
  EXPENSE: ["Alimentação", "Transporte", "Moradia", "Saúde", "Educação", "Lazer", "Compras", "Contas", "Outros"],
  DEBT: ["Empréstimo", "Cartão de Crédito", "Financiamento", "Cheque Especial", "Outros"],
};

const recurrenceOptions: Record<RecurrenceType, { label: string; icon: React.ReactNode }> = {
  none: { label: "Não repete", icon: <MdClose size={16} /> },
  daily: { label: "Diariamente", icon: <MdRepeat size={16} /> },
  weekly: { label: "Semanalmente", icon: <MdRepeat size={16} /> },
  monthly: { label: "Mensalmente", icon: <MdRepeat size={16} /> },
  yearly: { label: "Anualmente", icon: <MdRepeat size={16} /> },
};

const typeOptions: Record<TransactionType, { label: string; color: string; icon: React.ReactNode }> = {
  INCOME: { label: "Receita", color: "#10B981", icon: <MdTrendingUp size={20} /> },
  EXPENSE: { label: "Despesa", color: "#EF4444", icon: <MdTrendingDown size={20} /> },
  DEBT: { label: "Dívida", color: "#F59E0B", icon: <MdCreditCard size={20} /> },
};

// Fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Falha ao carregar dados.");
  return data;
};

// Tab Navigation Component
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: "dashboard" | "calendar" | "statement") => void;
  tabs: TabItem[];
}

function TabNav({ activeTab, onTabChange, tabs }: TabNavProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as "dashboard" | "calendar" | "statement")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[var(--surface)] text-[var(--primary)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--primary)]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Floating Add Button Component
interface FloatAddButtonProps {
  onClick: () => void;
}

function FloatAddButton({ onClick }: FloatAddButtonProps) {
  return (
    <div className="fixed right-6 top-24 z-50 md:top-28">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-vexyn-500 to-emerald-600 px-5 py-3.5 text-white shadow-lg shadow-vexyn-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-vexyn-500/40 active:scale-95"
        aria-label="Adicionar transação"
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] transition-transform duration-300 group-hover:translate-x-full" />
        <MdAdd size={20} className="relative z-10" />
        <span className="relative z-10 hidden text-sm font-semibold md:inline">Nova Transação</span>
      </button>
    </div>
  );
}

// Dropdown Menu Component
interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd: (type: TransactionType) => void;
}

function AddMenuDropdown({ isOpen, onClose, onQuickAdd }: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Adicionar rápido
      </div>
      <div className="grid gap-1">
        {(['INCOME', 'EXPENSE', 'DEBT'] as TransactionType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              onQuickAdd(type);
              onClose();
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-[var(--primary-soft)]"
          >
            <span className="text-[10px]" style={{ color: typeOptions[type].color }}>
              {typeOptions[type].icon}
            </span>
            <span className="text-sm font-medium text-[var(--text)]">{typeOptions[type].label}</span>
          </button>
        ))}
      </div>
      <div className="my-2 h-px bg-[var(--border)]" />
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Templates
      </div>
      <div className="grid gap-1">
        <button
          type="button"
          onClick={() => {
            onClose();
            // Could open a template modal
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-[var(--primary-soft)]"
        >
          <MdTag size={16} className="text-[var(--muted)]" />
          <span className="text-sm font-medium text-[var(--text)]">Transferência</span>
        </button>
      </div>
    </div>
  );
}

// Transaction Card Component
function TransactionCard({ transaction }: { transaction: Transaction }) {
  const type = typeOptions[transaction.type];
  const date = new Date(transaction.date).toLocaleDateString("pt-BR");
  const amount = (transaction.amount / 100).toFixed(2);

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:border-[var(--primary)]/30 hover:bg-[var(--surface-soft)]">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${type.color}20` }}
      >
        <span style={{ color: type.color }}>{type.icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--text)]">{transaction.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
          <span>{date}</span>
          {transaction.category && (
            <>
              <span className="block h-1 w-1 rounded-full bg-[var(--border)]" />
              <span>{transaction.category}</span>
            </>
          )}
          {transaction.recurrence && transaction.recurrence !== "none" && (
            <>
              <span className="block h-1 w-1 rounded-full bg-[var(--border)]" />
              <span className="flex items-center gap-1">
                <MdRepeat size={12} />
                {recurrenceOptions[transaction.recurrence].label}
              </span>
            </>
          )}
        </div>
      </div>
      <span
        className={`shrink-0 text-sm font-bold ${
          transaction.type === "INCOME" ? "text-green-600" : transaction.type === "DEBT" ? "text-amber-600" : "text-red-600"
        }`}
      >
        {transaction.type === "INCOME" ? "+" : "-"}R$ {amount}
      </span>
    </div>
  );
}

// Main Finance Component
export function Finance() {
  const { data: session, error: sessionError, isLoading: sessionLoading } = useSWR<Session>("/api/auth/session", fetcher);
  const { data: transactionsData, error: transactionsError, isLoading: transactionsLoading, mutate } = useSWR<{ transactions: Transaction[] }>(
    "/api/finance/transactions",
    fetcher
  );

  // State
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "statement">("dashboard");
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: "EXPENSE" as TransactionType,
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    recurrence: "none" as RecurrenceType,
    notes: "",
  });

  const loading = sessionLoading || transactionsLoading;
  const transactions = transactionsData?.transactions || [];

  // Calculations
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === "INCOME") acc.income += t.amount;
        else if (t.type === "EXPENSE") acc.expense += t.amount;
        else if (t.type === "DEBT") acc.debt += t.amount;
        return acc;
      },
      { income: 0, expense: 0, debt: 0 }
    );
  }, [transactions]);

  const balance = totals.income - totals.expense - totals.debt;

  // Handlers
  const handleQuickAdd = (type: TransactionType) => {
    setFormData((prev) => ({ ...prev, type }));
    setShowFormModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount) * 100,
          category: formData.category,
          recurrence: formData.recurrence,
          notes: formData.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Não foi possível adicionar a transação.");
        return;
      }

      setFormData({
        type: "EXPENSE" as TransactionType,
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        recurrence: "none",
        notes: "",
      });
      setShowFormModal(false);
      mutate();
      setMessage("✓ Transação adicionada com sucesso!");

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage("Erro ao adicionar transação. Tente novamente.");
    }
  };

  if (loading) {
    return <LoadingScreen message="Carregando aplicativo financeiro..." />;
  }

  if (sessionError || !session?.authenticated) {
    return (
      <main className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
            <MdAccountBalanceWallet size={32} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Acesso restrito</h1>
          <p className="mt-3 text-[var(--muted)]">Faça login para acessar suas finanças.</p>
          <a href="/login" className="mt-8 inline-flex rounded-3xl bg-vexyn-500 px-6 py-3 text-sm font-semibold text-white hover:bg-vexyn-400">
            Fazer login
          </a>
        </div>
      </main>
    );
  }

  if (transactionsError) {
    return (
      <main className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-soft">
          <h1 className="text-3xl font-semibold">Erro ao carregar financeiro</h1>
          <p className="mt-4 text-[var(--muted)]">{transactionsError.message}</p>
          <a href="/marketplace" className="mt-8 inline-flex rounded-3xl bg-vexyn-500 px-6 py-3 text-sm font-semibold text-white hover:bg-vexyn-400">
            Voltar
          </a>
        </div>
      </main>
    );
  }

  return (
    <PageShell
      title="Financeiro"
      subtitle="Controle suas finanças pessoais"
      active="/finance"
      admin={session.session?.role === "ADMIN"}
      actions={<ThemeToggle />}
      impersonatorId={session.session?.impersonatorId}
    >
      {/* Message Toast Area */}
      {message && (
        <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm font-medium text-green-600 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
          {message}
        </div>
      )}

      {/* Subpage Navigation Tabs */}
      <TabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "dashboard", label: "Dashboard", icon: <MdPieChart size={18} />, count: 3 },
          { id: "calendar", label: "Calendário", icon: <MdCalendarToday size={18} />, count: transactions.length },
          { id: "statement", label: "Extrato", icon: <MdList size={18} />, count: transactions.length },
        ]}
      />
      <div className="relative">
        <button
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-all hover:bg-[var(--surface)]"
          aria-label="Adicionar nova transação"
        >
          <MdAdd size={18} />
          <span className="hidden sm:inline">Adicionar</span>
          <MdKeyboardArrowDown size={16} className={`transition-transform ${isAddMenuOpen ? "rotate-180" : ""}`} />
        </button>
        <AddMenuDropdown isOpen={isAddMenuOpen} onClose={() => setIsAddMenuOpen(false)} onQuickAdd={handleQuickAdd} />
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="mt-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-soft)] p-5 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Saldo Total</p>
                  <p className={`mt-2 text-2xl font-bold ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                    R$ {(balance / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-soft)]">
                  <MdAccountBalanceWallet size={24} className="text-[var(--primary)]" />
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <MdTrendingUp size={14} />
                  {totals.income > 0 && "+"}
                  R$ {(totals.income / 100).toFixed(2)}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <MdTrendingDown size={14} />
                  -R$ {(totals.expense / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-transparent to-[var(--surface-soft)] p-5 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Receitas</p>
                  <p className="mt-2 text-2xl font-bold text-green-600">R$ {(totals.income / 100).toFixed(2)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                  <MdTrendingUp size={24} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-transparent to-[var(--surface-soft)] p-5 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Despesas</p>
                  <p className="mt-2 text-2xl font-bold text-red-600">R$ {(totals.expense / 100).toFixed(2)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                  <MdTrendingDown size={24} className="text-red-500" />
                </div>
              </div>
            </div>

            {totals.debt > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-transparent to-[var(--surface-soft)] p-5 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Dívidas</p>
                    <p className="mt-2 text-2xl font-bold text-amber-600">R$ {(totals.debt / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                    <MdCreditCard size={24} className="text-amber-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text)]">Transações Recentes</h2>
              <button
                onClick={() => setActiveTab("statement")}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((t) => <TransactionCard key={t.id} transaction={t} />)
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-12 text-center">
                  <Wallet size={48} className="mb-4 text-[var(--muted)]" />
                  <p className="text-[var(--muted)]">Nenhuma transação ainda</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Comece adicionando sua primeira transação</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text)]">Calendário de Transações</h2>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--surface-soft)]">
                Hoje
              </button>
              <div className="flex items-center gap-1">
                <button className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--text)] hover:bg-[var(--surface-soft)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--text)] hover:bg-[var(--surface-soft)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px rounded-xl bg-[var(--border)] overflow-hidden">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
              <div key={day} className="bg-[var(--surface-soft)] p-3 text-center text-xs font-semibold text-[var(--muted)]">
                {day}
              </div>
            ))}
            {Array.from({ length: 42 }).map((_, i) => {
              const day = i - 7 + 1;
              const isCurrent = day === 15;
              const hasTransactions = [3, 8, 12, 15, 20, 28].includes(day);
              return (
                <div
                  key={i}
                  className={`aspect-square p-2 text-center text-sm ${
                    day < 1 ? "text-[var(--muted)]/30" : "text-[var(--text)]"
                  } ${isCurrent ? "bg-[var(--primary)] text-white font-semibold" : "bg-[var(--surface)]"} ${hasTransactions && day > 0 ? "ring-1 ring-inset ring-[var(--primary)]" : ""}
                  hover:bg-[var(--surface-soft)] transition-colors cursor-pointer`}
                >
                  {day > 0 ? day : ""}
                  {hasTransactions && day > 0 && (
                    <div className="mt-0.5 flex justify-center gap-px">
                      <span className="h-1 w-1 rounded-full bg-green-500"></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statement Tab */}
      {activeTab === "statement" && (
        <div className="mt-6 space-y-6">
          {/* Filter Bar */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--text)] placeholder:[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                />
                <select className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none">
                  <option value="all">Todos os tipos</option>
                  <option value="income">Receitas</option>
                  <option value="expense">Despesas</option>
                  <option value="debt">Dívidas</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span>Exibindo {transactions.length} transações</span>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((t) => <TransactionCard key={t.id} transaction={t} />)
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
                <MdAttachMoney className="mx-auto h-12 w-12 text-[var(--muted)]" />
                <p className="mt-4 text-[var(--muted)]">Nenhuma transação registrada</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Clique no botão + para adicionar sua primeira transação</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowFormModal(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">Nova Transação</h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="rounded-lg p-1 hover:bg-[var(--primary-soft)] transition-colors"
                aria-label="Fechar"
              >
                <MdClose size={20} className="text-[var(--muted)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">              {/* Type Toggle */}
              <div className="grid grid-cols-3 gap-2">
                {(["INCOME", "EXPENSE", "DEBT"] as TransactionType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                      formData.type === type
                        ? "border-black/20 bg-black/5 shadow-sm"
                        : "border-[var(--border)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
                    }`}
                    style={{ borderColor: formData.type === type ? typeOptions[type].color : undefined }}
                  >
                    <span style={{ color: typeOptions[type].color }}>{typeOptions[type].icon}</span>
                    <span className="text-xs font-medium text-[var(--text)]">{typeOptions[type].label}</span>
                  </button>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text)]">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Supermercado, Salário..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                  required
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text)]">Valor</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0,00"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] py-3 pl-10 pr-4 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text)]">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text)]">Categoria</label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 pr-10 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {(categoriesByType[formData.type] || []).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <MdKeyboardArrowDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  </div>
                </div>
              </div>

              {/* Recurrence */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text)]">Recorrência</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(recurrenceOptions).map(([key, { label, icon }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, recurrence: key as RecurrenceType })}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center text-xs transition-all duration-200 ${
                        formData.recurrence === key
                          ? "border-black/20 bg-black/5 shadow-sm"
                          : "border-[var(--border)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
                      }`}
                      style={{ borderColor: formData.recurrence === key ? typeOptions[formData.type].color : undefined }}
                    >
                      <span>{icon}</span>
                      <span className="text-[10px]">{label.length > 8 ? label.slice(0, 8) + "..." : label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text)]">Notas (opcional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre esta transação..."
                  rows={2}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] transition-all hover:bg-[var(--surface)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-vexyn-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-vexyn-400 active:scale-95"
                >
                  Adicionar Transação
                </button>
              </div>
            </form>
          </div>
        </div>
       )}

      {/* Float Add Button - visible on all tabs */}
      <FloatAddButton onClick={() => {
        setIsAddMenuOpen(false);
        setShowFormModal(true);
      }} />
    </PageShell>
  );
}

