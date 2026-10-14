/* Kullanım: npm run import:wordpress -- https://www.ragipsavassanat.com [--metinler] */
import { importFromWordPress } from "../src/lib/wordpress-import";

const url = process.argv.find((a) => a.startsWith("http")) ?? "https://www.ragipsavassanat.com";
importFromWordPress({
  baseUrl: url,
  gallery: true,
  posts: true,
  courseImages: true,
  courseTexts: process.argv.includes("--metinler"),
  log: (m) => console.log("•", m),
})
  .then((r) => {
    console.log("\n✓ Aktarım tamamlandı:", r);
    process.exit(0);
  })
  .catch((e) => {
    console.error("✗", e.message);
    process.exit(1);
  });
