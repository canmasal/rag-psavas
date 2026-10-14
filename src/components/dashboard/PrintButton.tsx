"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-dark btn-sm">
      <Printer className="h-4 w-4" /> Yazdır / PDF
    </button>
  );
}
