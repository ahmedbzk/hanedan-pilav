import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { GALERI } from "../app/content/galeri.ts";
import { SITE } from "../app/content/site.ts";
import { DILLER, SAYFA_ANAHTARLARI, type SayfaAnahtari, VARSAYILAN_DIL, sayfaYollari } from "../app/lib/rotalar.ts";

export const ORTAMLAR = ["staging", "production"] as const;
export type Ortam = (typeof ORTAMLAR)[number];

export function ortamOku(ham: string | undefined): Ortam {
  const deger = (ham ?? "production").trim() || "production";
  if (!(ORTAMLAR as readonly string[]).includes(deger)) {
    throw new Error(`SITE_ORTAM "${deger}" geçersiz; "staging" veya "production" olmalı.`);
  }
  return deger as Ortam;
}

export type SitemapKaydi = {
  readonly loc: string;
  readonly alternatifler: readonly { readonly hreflang: string; readonly href: string }[];
  readonly gorseller?: readonly string[];
};

const SITEMAP_DISI = new Set<string>(["bulunamadi"]);

// Görsel sitemap uzantısı: galeri sayfaları (TR ve EN) tüm gerçek fotoğrafları listeler.
function sayfaGorselleri(anahtar: SayfaAnahtari, taban: string): string[] {
  if (anahtar !== "galeri") return [];
  return GALERI.flatMap((o) => (o.src ? [`${taban}${o.src}`] : []));
}

export function sitemapKayitlari(taban: string = SITE.alanAdi): SitemapKaydi[] {
  const kayitlar: SitemapKaydi[] = [];
  for (const anahtar of SAYFA_ANAHTARLARI) {
    if (SITEMAP_DISI.has(anahtar)) continue;
    const yollar = Object.fromEntries(DILLER.map((d) => [d, sayfaYollari(anahtar, d)])) as Record<
      (typeof DILLER)[number],
      string[]
    >;
    for (const dil of DILLER) {
      yollar[dil].forEach((yol, i) => {
        const alternatifler = DILLER.map((d) => ({ hreflang: d as string, href: `${taban}${yollar[d][i]}` }));
        alternatifler.push({ hreflang: "x-default", href: `${taban}${yollar[VARSAYILAN_DIL][i]}` });
        const gorseller = sayfaGorselleri(anahtar, taban);
        kayitlar.push({ loc: `${taban}${yol}`, alternatifler, ...(gorseller.length > 0 ? { gorseller } : {}) });
      });
    }
  }
  return kayitlar;
}

function xmlKacis(metin: string): string {
  return metin.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function sitemapUret(kayitlar: readonly SitemapKaydi[], lastmod: string): string {
  const url = kayitlar
    .map((k) => {
      const alt = k.alternatifler
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlKacis(a.href)}"/>`)
        .join("\n");
      const gorsel = (k.gorseller ?? []).map((g) => `\n    <image:image><image:loc>${xmlKacis(g)}</image:loc></image:image>`).join("");
      return `  <url>\n    <loc>${xmlKacis(k.loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alt}${gorsel}\n  </url>`;
    })
    .join("\n");
  const ad = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ad}>\n${url}\n</urlset>\n`;
}

export function sonDegisiklikTarihi(env: NodeJS.ProcessEnv = process.env): string {
  const tarih = /^\d{4}-\d{2}-\d{2}$/;
  if (env.SITEMAP_LASTMOD && tarih.test(env.SITEMAP_LASTMOD)) return env.SITEMAP_LASTMOD;
  try {
    const cikti = execFileSync("git", ["log", "-1", "--format=%cs"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (tarih.test(cikti)) return cikti;
  } catch {
  }
  return new Date().toISOString().slice(0, 10);
}

export function robotsUret(ortam: Ortam, taban: string = SITE.alanAdi): string {
  if (ortam === "staging") return "User-agent: *\nDisallow: /\n";
  return `User-agent: *\nAllow: /\n\nSitemap: ${taban}/sitemap.xml\n`;
}

// EN bilinmeyen bayi kabuğu: bayi detay sayfasının HTML'i (istemci router'ı aynı rotayı eşler, hidrasyon uyuşur);
// head'deki SEO aralığı ve <main> EN 404 sayfasınınkilerle değiştirilir; 404'te olmayan JSON-LD blokları (işletme,
// kırıntı) silinir, ortak olanlar (kök grafiği) yerinde kalır, aksi halde hidrasyon sırası bozulur.
const SEO_ARALIGI = /<title>[\s\S]*?<meta name="twitter:image:alt"[^>]*\/>/;
const ANA_ARALIGI = /<main[\s\S]*<\/main>/;
const JSON_LD = /<script type="application\/ld\+json">[\s\S]*?<\/script>/g;
const NOINDEX = '<meta name="robots" content="noindex"/>';

export function bilinmeyenBayiKabugu(detay: string, bulunamadi: string): string {
  const seo = bulunamadi.match(SEO_ARALIGI)?.[0];
  const ana = bulunamadi.match(ANA_ARALIGI)?.[0];
  const bulunamadiLd: string[] = bulunamadi.match(JSON_LD) ?? [];
  const detayLd: string[] = detay.match(JSON_LD) ?? [];
  if (!seo || !ana || !seo.includes(NOINDEX) || !SEO_ARALIGI.test(detay) || !ANA_ARALIGI.test(detay)) {
    throw new Error("EN 404 kabuğu üretilemedi: beklenen head/main aralıkları bulunamadı");
  }
  if (bulunamadiLd.some((b) => !detayLd.includes(b))) throw new Error("EN 404 kabuğu üretilemedi: 404 JSON-LD'si detay sayfasında yok");
  return detay
    .replace(SEO_ARALIGI, () => seo)
    .replace(ANA_ARALIGI, () => ana)
    .replace(JSON_LD, (blok) => (bulunamadiLd.includes(blok) ? blok : ""));
}

const CALISTIRILABILIR_TURLER = new Set(["", "module", "text/javascript", "application/javascript"]);

export function satirIciBetikHashleri(html: string): string[] {
  const hashler: string[] = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const nitelikler = m[1] ?? "";
    const icerik = m[2] ?? "";
    if (/\bsrc\s*=/i.test(nitelikler) || icerik.length === 0) continue;
    const tur = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(nitelikler)?.[1]?.toLowerCase() ?? "";
    if (!CALISTIRILABILIR_TURLER.has(tur)) continue;
    hashler.push(`'sha256-${createHash("sha256").update(icerik, "utf8").digest("base64")}'`);
  }
  return hashler;
}

export async function htmlDosyalari(klasor: string): Promise<string[]> {
  const sonuc: string[] = [];
  for (const oge of await readdir(klasor, { withFileTypes: true })) {
    const yol = join(klasor, oge.name);
    if (oge.isDirectory()) sonuc.push(...(await htmlDosyalari(yol)));
    else if (oge.name.endsWith(".html")) sonuc.push(yol);
  }
  return sonuc;
}

export async function tumBetikHashleri(klasor: string): Promise<string[]> {
  const set = new Set<string>();
  for (const dosya of await htmlDosyalari(klasor)) {
    for (const h of satirIciBetikHashleri(await readFile(dosya, "utf8"))) set.add(h);
  }
  return [...set].sort();
}

export function cspUret(betikHashleri: readonly string[]): string {
  return [
    "default-src 'self'",
    `script-src 'self' ${betikHashleri.join(" ")}`.trim(),
    "style-src 'self'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src https://www.google.com",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const BLOK = (ad: string) => new RegExp(`(# BEGIN ${ad}\\n)[\\s\\S]*?(# END ${ad})`);

function blokDoldur(sablon: string, ad: string, icerik: string): string {
  const re = BLOK(ad);
  if (!re.test(sablon)) throw new Error(`.htaccess şablonunda "${ad}" blok işaretleri yok.`);
  return sablon.replace(re, (_, bas: string, son: string) => `${bas}${icerik}\n  ${son}`);
}

export function htaccessIsle(sablon: string, ortam: Ortam, csp: string): string {
  const ortamSatirlari =
    ortam === "staging"
      ? '  Header always set X-Robots-Tag "noindex, nofollow"'
      : "  # production: ek başlık yok";
  const cspSatiri = `  Header always set Content-Security-Policy "${csp}"`;
  return blokDoldur(blokDoldur(sablon, "ORTAM", ortamSatirlari), "CSP", cspSatiri);
}
