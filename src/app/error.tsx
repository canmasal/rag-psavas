"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <h1 className="text-3xl">Bir şeyler ters gitti</h1>
        <p className="mt-2 text-muted">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
        <button type="button" onClick={reset} className="btn btn-dark mt-6">Tekrar dene</button>
      </div>
    </div>
  );
}
