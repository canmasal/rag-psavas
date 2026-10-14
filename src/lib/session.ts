// Edge uyumlu oturum yardımcıları (middleware içinde de kullanılır)
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "rs_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 gün

export type SessionPayload = { uid: string; role: string; name: string };

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET tanımlı değil");
    return new TextEncoder().encode("gelistirme-ortami-icin-gecici-anahtar-degistirin");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { uid: String(payload.uid), role: String(payload.role), name: String(payload.name) };
  } catch {
    return null;
  }
}
