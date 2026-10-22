import { BAYILER, type Bayi, yolTarifiHref } from "../content/bayiler.ts";
import { GALERI } from "../content/galeri.ts";
import { SITE } from "../content/site.ts";
import { type Dil, VARSAYILAN_DIL, yol } from "./rotalar.ts";

const KOK = SITE.alanAdi;
const ORGANIZASYON_ID = `${KOK}/#organization`;
const WEBSITE_ID = `${KOK}/#website`;
const LOGO = { yol: "/img/logo-saydam.png", genislik: 520, yukseklik: 188 };

const HAFTA_GUNLERI = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export type JsonLd = Record<string, unknown>;

function postaAdresi(satir: string, postaKodu: string, ilce: string, il: string): JsonLd {
  return { "@type": "PostalAddress", streetAddress: satir, postalCode: postaKodu, addressLocality: ilce, addressRegion: il, addressCountry: "TR" };
}

export function organizasyonJsonLd(): JsonLd {
  const a = SITE.adres;
  const eposta = SITE.eposta;
  return {
    "@type": "Organization",
    "@id": ORGANIZASYON_ID,
    name: SITE.marka,
    url: `${KOK}/`,
    logo: { "@type": "ImageObject", url: `${KOK}${LOGO.yol}`, width: LOGO.genislik, height: LOGO.yukseklik },
    foundingDate: String(SITE.kurulusYili),
    telephone: SITE.telefon.e164,
    ...(eposta ? { email: eposta } : {}),
    address: postaAdresi(`${a.mahalle}, ${a.cadde} ${a.kapiNo}`, a.postaKodu, a.ilce, a.il),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: SITE.telefon.e164,
      ...(eposta ? { email: eposta } : {}),
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
    ...(SITE.sosyal.length > 0 ? { sameAs: SITE.sosyal.map((s) => s.url) } : {}),
  };
}

export function webSiteJsonLd(dil: Dil): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.marka,
    url: `${KOK}/`,
    inLanguage: dil,
    publisher: { "@id": ORGANIZASYON_ID },
  };
}

export function kokJsonLd(dil: Dil): JsonLd {
  return { "@context": "https://schema.org", "@graph": [organizasyonJsonLd(), webSiteJsonLd(dil)] };
}

export function bayiCalismaSaatleri(bayi: Bayi): typeof SITE.calismaSaatleri | null {
  return bayi.tur === "merkez" ? SITE.calismaSaatleri : null;
}

// Dilden bağımsız kimlik: TR ve EN sayfaları aynı işletmeyi anlatır.
export function bayiId(bayi: Bayi): string {
  return `${KOK}${yol("bayiDetay", VARSAYILAN_DIL, { slug: bayi.slug })}#isletme`;
}

// Merkezde tüm gerçek fotoğraflar (mutfak, şube, ürün); şubede yalnız ürün fotoğrafları, yoksa logo.
export function bayiGorselleri(bayi: Bayi): string[] {
  const fotolar = GALERI.filter((o) => o.src && (bayi.tur === "merkez" || o.kategori === "urunler")).map((o) => `${KOK}${o.src}`);
  return fotolar.length > 0 ? fotolar : [`${KOK}${LOGO.yol}`];
}

export function bayiJsonLd(bayi: Bayi, dil: Dil): JsonLd {
  const saat = bayiCalismaSaatleri(bayi);
  const merkez = bayi.tur === "merkez";
  const url = `${KOK}${yol("bayiDetay", dil, { slug: bayi.slug })}`;
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": bayiId(bayi),
    name: `${SITE.marka} ${bayi.ad[dil]}`,
    url,
    image: bayiGorselleri(bayi),
    logo: `${KOK}${LOGO.yol}`,
    servesCuisine: "Turkish",
    address: postaAdresi(bayi.adres.satir, bayi.adres.postaKodu, bayi.adres.ilce, bayi.adres.il),
    hasMap: yolTarifiHref(bayi),
    ...(bayi.telefon ? { telephone: bayi.telefon.e164 } : {}),
    ...(merkez && SITE.eposta ? { email: SITE.eposta } : {}),
    // Koordinat yalnız doğrulanmış konum varsa yazılır (bayiler.ts "konum"); tahmin edilmez.
    ...(bayi.konum ? { geo: { "@type": "GeoCoordinates", latitude: bayi.konum.lat, longitude: bayi.konum.lng } } : {}),
    ...(saat
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [...HAFTA_GUNLERI],
            opens: saat.acilis,
            closes: saat.kapanis,
          },
        }
      : {}),
    ...(merkez
      ? { areaServed: SITE.hizmetBolgeleri.map((b) => ({ "@type": "AdministrativeArea", name: `${b.ad}, ${SITE.adres.il}` })) }
      : {}),
    brand: { "@id": ORGANIZASYON_ID },
  };
}

// Ana sayfa ve iletişim sayfası merkezi (Sultangazi) işletme olarak tanıtır.
export function merkezJsonLd(dil: Dil): JsonLd[] {
  const merkez = BAYILER.find((b) => b.tur === "merkez");
  return merkez ? [bayiJsonLd(merkez, dil)] : [];
}

export type Kirinti = { readonly ad: string; readonly yol: string };

export function kirintiJsonLd(ogeler: readonly Kirinti[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: ogeler.map((o, i) => ({ "@type": "ListItem", position: i + 1, name: o.ad, item: `${KOK}${o.yol}` })),
  };
}

export function jsonLdMetni(veri: JsonLd): string {
  return JSON.stringify(veri).replace(/</g, "\\u003c");
}
