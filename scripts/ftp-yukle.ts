import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "basic-ftp";

// build/client içeriğini FTPS ile web köküne yükler. Bilgiler repoya girmeyen .env.yayin dosyasından okunur
// (FTP_SUNUCU, FTP_KULLANICI, FTP_SIFRE, FTP_DIZIN). Önce `npm run build` ve `npm run check:yayin` koşmuş olmalıdır; `npm run yayin` üçünü sırayla yapar.

const kok = resolve(process.argv[2] ?? "build/client");
const envDosyasi = resolve(".env.yayin");

try {
  process.loadEnvFile(envDosyasi);
} catch {
  console.error(`${envDosyasi} okunamadı; FTP_SUNUCU, FTP_KULLANICI, FTP_SIFRE ve FTP_DIZIN satırlarıyla oluşturun.`);
  process.exit(1);
}

const gerekli = ["FTP_SUNUCU", "FTP_KULLANICI", "FTP_SIFRE", "FTP_DIZIN"] as const;
const eksik = gerekli.filter((k) => !process.env[k]?.trim());
if (eksik.length > 0) {
  console.error(`.env.yayin içinde boş alan var: ${eksik.join(", ")}`);
  process.exit(1);
}
const dizin = process.env.FTP_DIZIN!.trim();
if (!dizin.startsWith("/") || !dizin.endsWith("/")) {
  console.error(`FTP_DIZIN "${dizin}" / ile başlayıp / ile bitmeli (FTP hesabının kökü web köküyse "/").`);
  process.exit(1);
}

const istemci = new Client(60_000);
try {
  await istemci.access({
    host: process.env.FTP_SUNUCU!.trim(),
    user: process.env.FTP_KULLANICI!.trim(),
    password: process.env.FTP_SIFRE!,
    secure: true,
  });
  await istemci.ensureDir(dizin);
  console.log(`yükleniyor: ${kok} -> ${dizin}`);
  await istemci.uploadFromDir(kok);

  // Dosya adları hash'li olduğu için her yayında yeni assets dosyaları oluşur; yerelde olmayan eskiler silinir.
  const yerel = new Set(await readdir(resolve(kok, "assets")));
  const eskiler = (await istemci.list(`${dizin}assets`)).filter((d) => d.isFile && !yerel.has(d.name));
  for (const d of eskiler) await istemci.remove(`${dizin}assets/${d.name}`);
  console.log(`ftp-yukle: tamam (${eskiler.length} eski assets dosyası silindi)`);
} catch (e) {
  console.error("ftp-yukle BAŞARISIZ:", e instanceof Error ? e.message : e);
  process.exitCode = 1;
} finally {
  istemci.close();
}
