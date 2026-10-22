import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { bilinmeyenBayiKabugu, cspUret, htaccessIsle, ortamOku, robotsUret, tumBetikHashleri } from "./yayin-lib.ts";

const kok = resolve(process.argv[2] ?? "build/client");
const ortam = ortamOku(process.env.SITE_ORTAM);

await writeFile(resolve(kok, "robots.txt"), robotsUret(ortam));

const enDizin = resolve(kok, "en/locations");
const ornekBayi = (await readdir(enDizin, { withFileTypes: true })).find((o) => o.isDirectory());
if (!ornekBayi) throw new Error("en/locations altında bayi detay çıktısı yok");
const enBulunamadi = await readFile(resolve(kok, "en/404/index.html"), "utf8");
const enDetay = await readFile(resolve(enDizin, ornekBayi.name, "index.html"), "utf8");
await writeFile(resolve(enDizin, "__bilinmeyen.html"), bilinmeyenBayiKabugu(enDetay, enBulunamadi));

const hashler = await tumBetikHashleri(kok);
const sablon = await readFile(resolve(kok, ".htaccess"), "utf8");
await writeFile(resolve(kok, ".htaccess"), htaccessIsle(sablon, ortam, cspUret(hashler)));

console.log(`yayın hazırlığı: ortam=${ortam}, robots.txt yazıldı, .htaccess CSP ${hashler.length} betik hash'iyle işlendi`);
