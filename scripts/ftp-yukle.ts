import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "basic-ftp";

// build/client içeriğini FTP ile web köküne yükler. Bilgiler repoya girmeyen .env.yayin dosyasından okunur
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
  console.error(`FTP_DIZIN "${dizin}" / ile başlayıp / ile bitmeli (ör. "/httpdocs/").`);
  process.exit(1);
}

// isimtescil Eko paketi FTPS sunmuyor. Şifresiz FTP yalnız .env.yayin'de FTP_SIFRESIZ=evet yazılıysa kullanılır;
// bu durumda şifre ağda düz metin gider, yükleme yalnız güvenilen (ev/iş) ağdan yapılmalıdır.
const sifresiz = process.env.FTP_SIFRESIZ?.trim() === "evet";
if (sifresiz) console.warn("UYARI: şifresiz FTP kullanılıyor; yalnız güvenilen ağdan yükleyin.");

const istemci = new Client(60_000);
try {
  await istemci.access({
    host: process.env.FTP_SUNUCU!.trim(),
    user: process.env.FTP_KULLANICI!.trim(),
    password: process.env.FTP_SIFRE!,
    secure: !sifresiz,
  });
  await istemci.ensureDir(dizin);
  // Hedefte httpdocs varsa ana dizindeyiz demektir (FTP kökü web kökü değil); site yanlış yere yayılmasın.
  if ((await istemci.list()).some((d) => d.isDirectory && d.name === "httpdocs")) {
    throw new Error(`FTP_DIZIN "${dizin}" web kökü değil, içinde httpdocs var; "/httpdocs/" olmalı.`);
  }
  console.log(`yükleniyor: ${kok} -> ${dizin}`);
  await istemci.uploadFromDir(kok);

  // Dosya adları hash'li olduğu için her yayında yeni assets dosyaları oluşur; yerelde olmayan eskiler silinir.
  const yerel = new Set(await readdir(resolve(kok, "assets")));
  const eskiler = (await istemci.list(`${dizin}assets`)).filter((d) => d.isFile && !yerel.has(d.name));
  for (const d of eskiler) await istemci.remove(`${dizin}assets/${d.name}`);

  // Panelden zip açınca izinler 777/666 kalabiliyor; yüklenen her şey dizinde 755, dosyada 644 yapılır.
  let izinHatasi = 0;
  const izinVer = async (yerelYol: string, uzakYol: string): Promise<void> => {
    for (const g of await readdir(yerelYol, { withFileTypes: true })) {
      const uzak = `${uzakYol}${g.name}`;
      try {
        await istemci.send(`SITE CHMOD ${g.isDirectory() ? "755" : "644"} ${uzak}`);
      } catch {
        izinHatasi++;
      }
      if (g.isDirectory()) await izinVer(resolve(yerelYol, g.name), `${uzak}/`);
    }
  };
  await izinVer(kok, dizin);
  if (izinHatasi > 0) console.warn(`UYARI: ${izinHatasi} öğenin izni ayarlanamadı (sunucu SITE CHMOD'u reddetti).`);
  console.log(`ftp-yukle: tamam (${eskiler.length} eski assets dosyası silindi)`);
} catch (e) {
  console.error("ftp-yukle BAŞARISIZ:", e instanceof Error ? e.message : e);
  process.exitCode = 1;
} finally {
  istemci.close();
}
