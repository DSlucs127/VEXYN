interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl">
        <p className="text-lg font-semibold text-slate-900">{message}</p>
      </div>
    </div>
  );
}
