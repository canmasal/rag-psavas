"use client";

import { useActionState, useState } from "react";
import { CreditCard } from "lucide-react";
import { completeTestPayment } from "@/app/actions/member";
import { FormAlert, type FormState } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatPrice } from "@/lib/utils";

export function TestCardForm({ paymentId, amount }: { paymentId: string; amount: number }) {
  const [state, action] = useActionState<FormState, FormData>(completeTestPayment, undefined);
  const [card, setCard] = useState("5528 7900 0000 0008");
  const [inst, setInst] = useState(1);
  const fmt = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="paymentId" value={paymentId} />
      <div><label className="label" htmlFor="holder">Kart üzerindeki isim</label><input id="holder" name="holder" className="input" defaultValue="Test Kullanıcı" /></div>
      <div>
        <label className="label" htmlFor="card">Kart numarası</label>
        <div className="relative"><input id="card" name="card" className="input pl-11 font-mono tracking-wider" value={card} onChange={(e) => setCard(fmt(e.target.value))} inputMode="numeric" /><CreditCard className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label" htmlFor="exp">Son kullanma</label><input id="exp" name="exp" className="input font-mono" defaultValue="12/30" /></div>
        <div><label className="label" htmlFor="cvc">CVC</label><input id="cvc" name="cvc" className="input font-mono" defaultValue="123" maxLength={4} /></div>
      </div>
      <div>
        <p className="label">Taksit seçenekleri</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[1, 2, 3, 6].map((n) => (
            <button type="button" key={n} onClick={() => setInst(n)} className={`rounded-xl border p-2.5 text-center text-xs font-semibold ${inst === n ? "border-ink ring-2 ring-ink" : "border-line"}`}>
              {n === 1 ? "Tek çekim" : `${n} taksit`}<span className="block text-muted">{formatPrice(Math.round(amount / n))}</span>
            </button>
          ))}
        </div>
      </div>
      <FormAlert state={state} />
      <SubmitButton className="w-full" pendingText="3D Secure doğrulanıyor…">{formatPrice(amount)} Öde</SubmitButton>
    </form>
  );
}
