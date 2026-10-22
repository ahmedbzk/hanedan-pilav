export const haritaTr = {
  grupAria: "İstanbul ilçe haritası",
  sadeceBilgiAria: "İstanbul haritası",
  bayiVar: "şube var",
  bayiYok: "şube yok",
  hizmetVar: "hizmet bölgesi",
  secili: "seçili",
  ilceAria: (ad: string, durum: string) => `${ad}, ${durum}`,
  pinKonumNotu: "İşaret ilçenin ortasını gösterir, tam adresi değil.",
  atif: "© OpenStreetMap’e katkıda bulunanlar",
  merkezEtiket: "Merkez",
  bolgeler: {
    baslik: "Hizmet bölgelerimiz",
    merkez: "Merkez / İmalathane",
    liste: "Hizmet verdiğimiz bölgeler",
    ilceMetni: (ilce: string) => `${ilce}, hizmet bölgemiz içinde yer alıyor. Teslimat ve toplu sipariş için bizimle iletişime geçin.`,
  },
};

export type HaritaMetni = typeof haritaTr;

export const haritaEn: HaritaMetni = {
  grupAria: "Istanbul district map",
  sadeceBilgiAria: "Map of Istanbul",
  bayiVar: "has a location",
  bayiYok: "no location",
  hizmetVar: "service area",
  secili: "selected",
  ilceAria: (ad, durum) => `${ad}, ${durum}`,
  pinKonumNotu: "Pins mark the middle of the district, not the exact address.",
  atif: "© OpenStreetMap contributors",
  merkezEtiket: "Headquarters",
  bolgeler: {
    baslik: "Our service areas",
    merkez: "Headquarters / Production site",
    liste: "Areas we serve",
    ilceMetni: (ilce) => `${ilce} is within our service area. Contact us for delivery and bulk orders.`,
  },
};

export const HARITA_METNI = { tr: haritaTr, en: haritaEn } as const;
