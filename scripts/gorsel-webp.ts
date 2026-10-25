// Galeri JPEG'lerinin WebP kopyalarını üretir: npm run gorsel:webp
// Her public/img/galeri/*.jpg için WEBP_GENISLIKLERI boylarında "<ad>-<genislik>.webp" yazar; güncel olanı atlar.
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { WEBP_GENISLIKLERI, webpYolu } from "../app/content/galeri.ts";

const DIZIN = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "img", "galeri");
const KALITE = 78;

let yazilan = 0;
for (const ad of readdirSync(DIZIN).filter((a) => /\.jpe?g$/i.test(a))) {
  const kaynak = join(DIZIN, ad);
  const { width: kaynakGenislik = 0 } = await sharp(kaynak).metadata();
  for (const genislik of WEBP_GENISLIKLERI) {
    const hedef = join(DIZIN, webpYolu(ad, genislik));
    let guncel = false;
    try {
      guncel = statSync(hedef).mtimeMs >= statSync(kaynak).mtimeMs;
    } catch {}
    if (guncel) continue;
    // Kaynaktan büyük boy istenirse büyütülmez; srcset'teki genişlik yine de doğru kalsın diye aynı boyda yazılır.
    await sharp(kaynak).rotate().resize({ width: Math.min(genislik, kaynakGenislik) }).webp({ quality: KALITE }).toFile(hedef);
    yazilan++;
    console.log(`${webpYolu(ad, genislik)}`);
  }
}
console.log(`gorsel-webp: ${yazilan} dosya yazıldı`);
