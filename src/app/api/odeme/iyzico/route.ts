import { NextResponse, type NextRequest } from "next/server";
import { completeIyzicoPayment } from "@/lib/payment";
import { siteUrl } from "@/lib/utils";

// iyzico ödeme sayfası, işlem sonunda bu adrese POST (form-urlencoded: token) ile döner.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  if (!token) return NextResponse.redirect(`${siteUrl()}/panel/odemeler`, 303);
  const payment = await completeIyzicoPayment(token);
  if (!payment) return NextResponse.redirect(`${siteUrl()}/panel/odemeler`, 303);
  const durum = payment.status === "PAID" ? "basarili" : "hata";
  return NextResponse.redirect(`${siteUrl()}/panel/odemeler/${payment.id}?durum=${durum}`, 303);
}
