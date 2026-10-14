import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormState = { ok?: boolean; error?: string; message?: string; fieldErrors?: Record<string, string> } | undefined;

export function FormAlert({ state, className }: { state: FormState; className?: string }) {
  if (!state || (!state.error && !state.message)) return null;
  const ok = !state.error;
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium",
        ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900",
        className,
      )}
    >
      {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{state.error ?? state.message}</span>
    </div>
  );
}

export function FieldError({ state, name }: { state: FormState; name: string }) {
  const msg = state?.fieldErrors?.[name];
  if (!msg) return null;
  return <p className="mt-1 text-xs font-semibold text-red-700">{msg}</p>;
}
