export type BayiTuru = "merkez" | "sube";

export type Bayi = {
  readonly slug: string;
  readonly tur: BayiTuru;
  readonly ad: { readonly tr: string; readonly en: string };
  readonly adres: {
    readonly satir: string;
    readonly postaKodu: string;
    readonly ilce: string;
    readonly il: string;
  };
  readonly telefon?: { readonly e164: string; readonly gorunen: string };
  readonly konum?: { readonly lat: number; readonly lng: number };
};

export const BAYILER: readonly Bayi[] = [
  {
    slug: "sultangazi-merkez",
    tur: "merkez",
    ad: { tr: "Sultangazi Merkez", en: "Sultangazi Headquarters" },
    adres: {
      satir: "Yunus Emre Mah., Adem Yavuz Cd. No:76",
      postaKodu: "34260",
      ilce: "Sultangazi",
      il: "İstanbul",
    },
    telefon: { e164: "+905336163754", gorunen: "+90 533 616 37 54" },
    // Google Haritalar yer kaydından (GOOGLE_HARITA ile aynı nokta).
    konum: { lat: 41.0942873, lng: 28.8932846 },
  },
];

export function bayiBul(slug: string | undefined): Bayi | undefined {
  return BAYILER.find((b) => b.slug === slug);
}

export function adresMetni(b: Bayi): string {
  return `${b.adres.satir}, ${b.adres.postaKodu} ${b.adres.ilce}/${b.adres.il}`;
}

export function yolTarifiHref(b: Bayi): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresMetni(b))}`;
}
