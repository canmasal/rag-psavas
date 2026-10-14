import Link from "next/link";
import { LogoMark } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-6 text-center text-white">
      <div>
        <LogoMark className="mx-auto h-16 w-16 text-accent" />
        <p className="mt-8 font-display text-8xl text-gold">404</p>
        <h1 className="mt-4 text-3xl">Perde kapandı, bu sayfa sahnede değil.</h1>
        <p className="mt-3 text-white/60">Aradığınız sayfa taşınmış ya da kaldırılmış olabilir.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Ana Sayfa</Link>
          <Link href="/egitimlerimiz" className="btn btn-ghost-light">Eğitimlerimiz</Link>
        </div>
      </div>
    </div>
  );
}
