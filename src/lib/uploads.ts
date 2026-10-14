import path from "node:path";

/** Yüklenen dosyaların saklandığı klasör (UPLOAD_DIR ile değiştirilebilir). */
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
