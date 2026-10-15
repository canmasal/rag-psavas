import path from "node:path";

/** Yüklenen dosyaların saklandığı klasör (UPLOAD_DIR ile değiştirilebilir). Vercel'de yalnızca /tmp yazılabilir. */
export const UPLOAD_DIR = process.env.UPLOAD_DIR || (process.env.VERCEL ? "/tmp/uploads" : path.join(process.cwd(), "uploads"));
