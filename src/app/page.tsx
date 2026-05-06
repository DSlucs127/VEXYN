"use client";

import { useEffect, useState } from "react";

type AppItem = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  owned: boolean;
};

type ApiResponse = {
  apps?: AppItem[];
  error?: string;
};

export default function Home() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [message, setMessage] = useState("Carregando...");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/marketplace/apps");
        const data: ApiResponse = await res.json();

        if (!res.ok || data.error) {
          setMessage(data.error ?? "Erro ao carregar apps");
          return;
        }

        setApps(data.apps ?? []);
        setMessage("Apps carregados com sucesso.");
      } catch (error) {
        setMessage("Erro de conexão com a API.");
      }
    }

    load();
  }, []);

  return (
    <main className="container mx-auto px-4 py-10">
      <section className="rounded-3xl bg-white/90 p-8 shadow-xl shadow-black/5 backdrop-blur-xl">
        <h1 className="mb-4 text-4xl font-bold text-slate-900">VEXYN SaaS</h1>
        <p className="mb-6 text-slate-600">Integração Supabase + Vercel confirmada. A API abaixo usa Prisma conectado ao banco Supabase.</p>
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Status da API:</p>
          <p className="mt-2 text-slate-500">{message}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {apps.map((app) => (
            <article key={app.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{app.name}</h2>
              <p className="mt-2 text-slate-600">{app.description}</p>
              <p className="mt-4 text-sm font-medium text-slate-700">{app.owned ? "Ativo" : "Não ativo"}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
