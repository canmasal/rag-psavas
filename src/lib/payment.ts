import "server-only";
import crypto from "node:crypto";
import { db } from "./db";
import { siteUrl } from "./utils";

/**
 * Ödeme sağlayıcısı: iyzico Checkout Form.
 * IYZICO_API_KEY ve IYZICO_SECRET_KEY tanımlı değilse site TEST MODUNDA çalışır;
 * kart ödemeleri gerçek bir işlem yapılmadan sitedeki test ödeme sayfasında simüle edilir.
 */
export function isIyzicoEnabled() {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

function iyzicoBase() {
  return (process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com").replace(/\/$/, "");
}

async function iyzicoRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.IYZICO_API_KEY!;
  const secretKey = process.env.IYZICO_SECRET_KEY!;
  const randomKey = `${Date.now()}${crypto.randomBytes(6).toString("hex")}`;
  const payload = JSON.stringify(body);
  // IYZWSv2 imzası: HMACSHA256(randomKey + uri.path + body)
  const signature = crypto.createHmac("sha256", secretKey).update(randomKey + path + payload).digest("hex");
  const authorization =
    "IYZWSv2 " + Buffer.from(`apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`).toString("base64");

  const res = await fetch(iyzicoBase() + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authorization,
      "x-iyzi-rnd": randomKey,
    },
    body: payload,
    cache: "no-store",
  });
  return (await res.json()) as T;
}

type CheckoutInitResponse = {
  status: "success" | "failure";
  errorMessage?: string;
  token?: string;
  paymentPageUrl?: string;
  checkoutFormContent?: string;
};

type CheckoutRetrieveResponse = {
  status: "success" | "failure";
  paymentStatus?: "SUCCESS" | "FAILURE" | "INIT_THREEDS" | "CALLBACK_THREEDS";
  paymentId?: string;
  basketId?: string;
  errorMessage?: string;
};

const price = (n: number) => n.toFixed(2);

/** Ödeme için iyzico ödeme sayfası oluşturur ve kullanıcının yönlendirileceği adresi döndürür. */
export async function startCardPayment(paymentId: string, clientIp: string): Promise<string> {
  const payment = await db.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: { user: true, enrollment: { include: { course: true } } },
  });

  if (!isIyzicoEnabled()) {
    await db.payment.update({ where: { id: payment.id }, data: { provider: "test" } });
    return `/odeme/test/${payment.id}`;
  }

  const [firstName, ...rest] = payment.user.name.trim().split(/\s+/);
  const lastName = rest.join(" ") || firstName;
  const address = payment.user.address || "Göktürk, Eyüpsultan";
  const city = payment.user.city || "İstanbul";

  const body = {
    locale: "tr",
    conversationId: payment.id,
    price: price(payment.amount),
    paidPrice: price(payment.amount),
    currency: "TRY",
    basketId: payment.id,
    paymentGroup: "PRODUCT",
    callbackUrl: `${siteUrl()}/api/odeme/iyzico`,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: payment.user.id,
      name: firstName,
      surname: lastName,
      gsmNumber: payment.user.phone || undefined,
      email: payment.user.email,
      identityNumber: payment.user.identityNo || "11111111111",
      registrationAddress: address,
      ip: clientIp,
      city,
      country: "Turkey",
    },
    shippingAddress: { contactName: payment.user.name, city, country: "Turkey", address },
    billingAddress: { contactName: payment.user.name, city, country: "Turkey", address },
    basketItems: [
      {
        id: payment.enrollment?.courseId ?? payment.id,
        name: payment.description.slice(0, 100),
        category1: payment.enrollment?.course.category ?? "Eğitim",
        itemType: "VIRTUAL",
        price: price(payment.amount),
      },
    ],
  };

  const result = await iyzicoRequest<CheckoutInitResponse>("/payment/iyzipos/checkoutform/initialize/auth/ecom", body);

  if (result.status !== "success" || !result.token || !result.paymentPageUrl) {
    await db.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", provider: "iyzico", errorMessage: result.errorMessage ?? "Ödeme başlatılamadı" },
    });
    return `/panel/odemeler/${payment.id}?durum=hata`;
  }

  await db.payment.update({ where: { id: payment.id }, data: { provider: "iyzico", providerToken: result.token } });
  return result.paymentPageUrl;
}

/** iyzico geri dönüşünde ödeme sonucunu doğrular. */
export async function completeIyzicoPayment(token: string) {
  const payment = await db.payment.findFirst({ where: { providerToken: token } });
  if (!payment) return null;
  if (payment.status === "PAID") return payment;

  const result = await iyzicoRequest<CheckoutRetrieveResponse>("/payment/iyzipos/checkoutform/auth/ecom/detail", {
    locale: "tr",
    conversationId: payment.id,
    token,
  });

  if (result.status === "success" && result.paymentStatus === "SUCCESS" && result.basketId === payment.id) {
    return markPaymentPaid(payment.id, result.paymentId ?? null);
  }
  return db.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED", errorMessage: result.errorMessage ?? "Ödeme onaylanmadı" },
  });
}

/** Ödemeyi başarılı olarak işaretler ve ilgili kaydı aktifleştirir. */
export async function markPaymentPaid(paymentId: string, providerPaymentId: string | null) {
  const payment = await db.payment.update({
    where: { id: paymentId },
    data: { status: "PAID", paidAt: new Date(), providerPaymentId, errorMessage: null },
    include: { enrollment: { include: { package: true } } },
  });
  if (payment.enrollment && payment.enrollment.status === "PENDING_PAYMENT") {
    const start = new Date();
    const months = payment.enrollment.package?.months ?? 1;
    const end = new Date(start);
    if (months > 0) end.setMonth(end.getMonth() + months);
    else end.setDate(end.getDate() + 7);
    await db.enrollment.update({
      where: { id: payment.enrollment.id },
      data: { status: "ACTIVE", startDate: start, endDate: end },
    });
  }
  return payment;
}
