import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { SITE } from "../app/content/site.ts";
import { epostaHatasi } from "./yayin-kapi.ts";

const kok = resolve(process.argv[2] ?? "build/client");
const hatalar: string[] = [];

if (!SITE.whatsapp.dogrulandi) hatalar.push(`WhatsApp numarası (${SITE.whatsapp.numara}) doğrulanmadı (site.ts whatsapp.dogrulandi).`);
const epostaSorunu = epostaHatasi(SITE.eposta);
if (epostaSorunu) hatalar.push(epostaSorunu);

async function oku(ad: string): Promise<string | null> {
  try {
    return await readFile(resolve(kok, ad), "utf8");
  } catch {
    return null;
  }
}

const robots = await oku("robots.txt");
if (robots === null) hatalar.push("build/client/robots.txt yok; önce npm run build koşulmalı.");
else if (/^Disallow:\s*\/\s*$/m.test(robots)) hatalar.push('robots.txt "Disallow: /" içeriyor (staging derlemesi production\'a gidemez).');

const htaccess = await oku(".htaccess");
if (htaccess === null) hatalar.push("build/client/.htaccess yok.");
else {
  if (!/Content-Security-Policy "[^"]*'sha256-/.test(htaccess)) hatalar.push(".htaccess içinde hash'li CSP yok (postbuild çalışmadı).");
  if (/X-Robots-Tag/.test(htaccess.replace(/^\s*#.*$/gm, ""))) hatalar.push(".htaccess staging noindex başlığı içeriyor.");
}
const anasayfa = await oku("index.html");
if (anasayfa === null) hatalar.push("build/client/index.html yok.");
else if (!anasayfa.includes(`<meta name="google-site-verification" content="${SITE.googleDogrulama}"/>`))
  hatalar.push("Ana sayfada Google Search Console doğrulama etiketi yok.");
if ((await oku("sitemap.xml")) === null) hatalar.push("build/client/sitemap.xml yok.");

if (hatalar.length > 0) {
  console.error(`check:yayin BAŞARISIZ (${hatalar.length} sorun):`);
  for (const h of hatalar) console.error(`  - ${h}`);
  process.exit(1);
}
console.log("check:yayin: tamam");
