import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ number }: { number: string }) {
  if (!number) return null;
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent("Merhaba, eğitimleriniz hakkında bilgi almak istiyorum.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-xl shadow-black/20 transition hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
