import type { MetaDescriptor } from "react-router";
import { SITE } from "~/content/site.ts";
import { type Sozluk, sozluk } from "~/i18n/index.ts";
import { type JsonLd, type Kirinti, kirintiJsonLd } from "./jsonld.ts";
import { ACIKLAMA_UST_SINIR, BASLIK_UST_SINIR, sinirla } from "./metin-sinir.ts";
import { DILLER, type Dil, type Parametreler, type SayfaAnahtari, VARSAYILAN_DIL, dilBul, yol } from "./rotalar.ts";

export const SITE_URL = SITE.alanAdi;

// Dil başına 1200x630 PNG; üretimi README "Görseller ve simgeler" bölümünde.
export const OG_GORSEL = {
  yol: { tr: "/img/og-hanedan-pilav.png", en: "/img/og-hanedan-pilav-en.png" } as Readonly<Record<Dil, string>>,
  genislik: 1200,
  yukseklik: 630,
};

export type SeoGirdisi = {
  anahtar: SayfaAnahtari;
  dil: Dil;
  baslik: string;
  aciklama: string;
  params?: Parametreler;
  indeksle?: boolean;
  // Kırıntının son öğesinin adı (ör. bayi adı); verilmezse sayfanın menü adı kullanılır.
  kirintiAdi?: string;
  jsonLd?: readonly JsonLd[];
};

function mutlak(yolVeyaUrl: string): string {
  return /^https?:\/\//.test(yolVeyaUrl) ? yolVeyaUrl : `${SITE_URL}${yolVeyaUrl}`;
}

function sayfaAdi(t: Sozluk, anahtar: SayfaAnahtari): string | null {
  switch (anahtar) {
    case "kurumsal":
    case "bayilerimiz":
    case "galeri":
    case "iletisim":
      return t.nav[anahtar];
    case "kvkk":
    case "cerez":
      return t.alt[anahtar];
    default:
      return null;
  }
}

export function kirintilar(anahtar: SayfaAnahtari, dil: Dil, params?: Parametreler, sonAd?: string): Kirinti[] {
  if (anahtar === "anasayfa" || anahtar === "bulunamadi") return [];
  const t = sozluk(dil);
  const ogeler: Kirinti[] = [{ ad: t.seo.anasayfa, yol: yol("anasayfa", dil) }];
  if (anahtar === "bayiDetay") ogeler.push({ ad: t.nav.bayilerimiz, yol: yol("bayilerimiz", dil) });
  const ad = sonAd ?? sayfaAdi(t, anahtar);
  if (!ad) throw new Error(`"${anahtar}" için kırıntı adı yok.`);
  ogeler.push({ ad, yol: yol(anahtar, dil, params) });
  return ogeler;
}

// Sıra sabittir: EN 404 kabuğu (scripts/yayin-lib.ts, bilinmeyenBayiKabugu) <title> ile son etiket twitter:image:alt arasını değiştirir.
export function seo({ anahtar, dil, baslik: hamBaslik, aciklama: hamAciklama, params, indeksle = true, kirintiAdi, jsonLd = [] }: SeoGirdisi): MetaDescriptor[] {
  const baslik = sinirla(hamBaslik, BASLIK_UST_SINIR);
  const aciklama = sinirla(hamAciklama, ACIKLAMA_UST_SINIR);
  const url = mutlak(yol(anahtar, dil, params));
  const gorselUrl = mutlak(OG_GORSEL.yol[dil]);
  const t = sozluk(dil);
  const etiketler: MetaDescriptor[] = [{ title: baslik }, { name: "description", content: aciklama }];
  // noindex sayfası (404) kanonik ve hreflang kümesine girmez.
  if (!indeksle) etiketler.push({ name: "robots", content: "noindex" });
  else {
    etiketler.push(
      { tagName: "link", rel: "canonical", href: url },
      ...DILLER.map((d): MetaDescriptor => ({ tagName: "link", rel: "alternate", hrefLang: d, href: mutlak(yol(anahtar, d, params)) })),
      { tagName: "link", rel: "alternate", hrefLang: "x-default", href: mutlak(yol(anahtar, VARSAYILAN_DIL, params)) },
      { property: "og:url", content: url },
    );
  }
  etiketler.push(
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE.marka },
    { property: "og:title", content: baslik },
    { property: "og:description", content: aciklama },
    { property: "og:locale", content: t.dil.ogLocale },
    ...DILLER.filter((d) => d !== dil).map((d): MetaDescriptor => ({ property: "og:locale:alternate", content: sozluk(d).dil.ogLocale })),
    { property: "og:image", content: gorselUrl },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: String(OG_GORSEL.genislik) },
    { property: "og:image:height", content: String(OG_GORSEL.yukseklik) },
    { property: "og:image:alt", content: t.seo.ogGorselAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: baslik },
    { name: "twitter:description", content: aciklama },
    { name: "twitter:image", content: gorselUrl },
    { name: "twitter:image:alt", content: t.seo.ogGorselAlt },
  );
  const kirinti = indeksle ? kirintilar(anahtar, dil, params, kirintiAdi) : [];
  for (const veri of [...jsonLd, ...(kirinti.length > 0 ? [kirintiJsonLd(kirinti)] : [])]) {
    etiketler.push({ "script:ld+json": veri });
  }
  return etiketler;
}

type SabitMetaliSayfa = keyof Sozluk["sayfalar"] & SayfaAnahtari;

export function sayfaSeo(anahtar: SabitMetaliSayfa, pathname: string, secenek: { indeksle?: boolean } = {}): MetaDescriptor[] {
  const dil = dilBul(pathname);
  const m = sozluk(dil).sayfalar[anahtar].meta;
  return seo({ anahtar, dil, baslik: m.baslik, aciklama: m.aciklama, ...secenek });
}
