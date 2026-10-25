export type Oran = "4:3" | "4:5" | "3:2" | "1:1" | "16:9";

export type Kategori = "urunler" | "uretim" | "organizasyon" | "bayiler";

export const KATEGORILER: readonly Kategori[] = ["urunler", "uretim", "organizasyon", "bayiler"];

type Temel = {
  readonly id: string;
  readonly kategori: Kategori;
  readonly oran: Oran;
  readonly tr: { readonly konu: string; readonly not: string };
  readonly en: { readonly konu: string; readonly not: string };
};

type Yerturucu = { readonly src?: undefined; readonly alt?: undefined };
type Fotografli = { readonly src: string; readonly alt: { readonly tr: string; readonly en: string } };

export type GaleriOgesi = Temel & (Yerturucu | Fotografli);

// Her JPEG'in yanında bu genişliklerde WebP kopyası durur (npm run gorsel:webp). JPEG; OG, JSON-LD ve sitemap içindir.
export const WEBP_GENISLIKLERI = [480, 800, 1200] as const;

export function webpYolu(src: string, genislik: number): string {
  return src.replace(/\.jpe?g$/i, `-${genislik}.webp`);
}

export function webpSrcSet(src: string): string | undefined {
  if (!/\.jpe?g$/i.test(src)) return undefined;
  return WEBP_GENISLIKLERI.map((g) => `${webpYolu(src, g)} ${g}w`).join(", ");
}

export const GALERI: readonly GaleriOgesi[] = [
  {
    id: "uretim-mutfagi",
    kategori: "uretim",
    oran: "16:9",
    tr: { konu: "üretim mutfağı", not: "Geniş plan; paslanmaz tezgâhlar, düzen ve temizlik." },
    en: { konu: "production kitchen", not: "Wide shot; stainless counters, order, and cleanliness." },
    src: "/img/galeri/hanedan-pilav-uretim-mutfagi.jpg",
    alt: {
      tr: "Hanedan Pilav üretim mutfağında siyah eldivenli usta, paslanmaz tezgâhta servis küvetini hazırlıyor",
      en: "A cook in black gloves preparing a stainless steel serving tray in the Hanedan Pilav production kitchen",
    },
  },
  {
    id: "pilav-ayran",
    kategori: "urunler",
    oran: "4:5",
    tr: { konu: "pilav, ayran ve turşu", not: "Masada servis, yandan çekim." },
    en: { konu: "pilaf with ayran and pickles", not: "Served at the table, side angle." },
    src: "/img/galeri/tavuklu-pilav-ayran-tursu.jpg",
    alt: {
      tr: "Ahşap masada tavuklu nohutlu pilav, köpüklü ayran ve bir kâse sarı biber turşusu",
      en: "Chicken and chickpea pilaf with a frothy glass of ayran and a bowl of pickled yellow peppers on a wooden table",
    },
  },
  {
    id: "aksam-cephe",
    kategori: "bayiler",
    oran: "4:5",
    tr: { konu: "akşam ışığında dükkân", not: "Tabela ışıklı, alacakaranlık." },
    en: { konu: "shop at dusk", not: "Sign lit, twilight." },
    src: "/img/galeri/hanedan-pilav-aksam-cephe.jpg",
    alt: {
      tr: "Akşam ışığında Hanedan Pilav dükkânı; sarı harfli ışıklı tabela ve ıslak kaldırım",
      en: "Hanedan Pilav shop at dusk with its lit yellow-lettered sign and a wet pavement",
    },
  },
  {
    id: "dukkan-cephesi",
    kategori: "bayiler",
    oran: "3:2",
    tr: { konu: "şube açılışı", not: "Tabela okunur, vitrin içeriden aydınlık." },
    en: { konu: "branch opening", not: "Sign legible, window lit from inside." },
    src: "/img/galeri/hanedan-pilav-sube-acilisi.jpg",
    alt: {
      tr: "Sarı siyah balonlar ve açılış çelenkleriyle süslenmiş Hanedan Pilav şubesinin cephesi",
      en: "Storefront of a Hanedan Pilav branch decorated with yellow and black balloons and opening wreaths",
    },
  },
  {
    id: "tabakta-pilav",
    kategori: "urunler",
    oran: "4:5",
    tr: { konu: "tabakta pilav", not: "Yandan çekim, doğal ışık." },
    en: { konu: "pilaf on the plate", not: "Side angle, natural light." },
    src: "/img/galeri/tavuklu-nohutlu-pilav.jpg",
    alt: {
      tr: "Beyaz tabakta, üzeri didiklenmiş tavukla kaplı nohutlu pirinç pilavı",
      en: "Chickpea rice pilaf topped with shredded chicken on a white plate",
    },
  },
];

