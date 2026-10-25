export type SosyalHesap = { readonly ad: string; readonly url: string };

export const SITE = {
  marka: "Hanedan Pilav",
  alanAdi: "https://www.hanedanpilav.com",
  kurulusYili: 1998,
  uretimKapasitesi: { miktar: 1, birim: "ton", periyot: "gunluk" },
  telefon: {
    e164: "+905336163754",
    gorunen: "+90 533 616 37 54",
  },
  whatsapp: {
    numara: "905406440202",
    gorunen: "+90 540 644 02 02",
    dogrulandi: true,
  },
  ipTemizlikGorevi: { kuruldu: true },
  adres: {
    mahalle: "Yunus Emre Mah.",
    cadde: "Adem Yavuz Cd.",
    kapiNo: "No:76",
    postaKodu: "34260",
    ilce: "Sultangazi",
    il: "İstanbul",
  },
  calismaSaatleri: {
    gunler: "her-gun",
    acilis: "09:00",
    kapanis: "17:00",
  },
  eposta: "info@hanedanpilav.com" as string | null,
  sosyal: [{ ad: "Instagram", url: "https://www.instagram.com/hanedanpilavresmi/" }] as readonly SosyalHesap[],
  instagramKullanici: "hanedanpilavresmi",
  hizmetBolgeleri: [
    { ad: "Gaziosmanpaşa", ilce: "gaziosmanpasa" },
    { ad: "Eyüpsultan", ilce: "eyupsultan" },
    { ad: "Bayrampaşa", ilce: "bayrampasa" },
    { ad: "Esenler", ilce: "esenler" },
    { ad: "Bağcılar", ilce: "bagcilar" },
    { ad: "Başakşehir", ilce: "basaksehir" },
    { ad: "Kayaşehir", ilce: "basaksehir" },
    { ad: "Arnavutköy", ilce: "arnavutkoy" },
    { ad: "Çağlayan", ilce: null },
    { ad: "Bahçelievler", ilce: "bahcelievler" },
  ] as readonly { readonly ad: string; readonly ilce: string | null }[],
  yasal: {
    // pencere_sn (hanedan-config.php) değişirse bu metin de güncellenir.
    ipSuresi: {
      tr: "Özet yalnız geçerli bir form gönderiminde oluşturulur ve son geçerli gönderimden 10 dakika sonra süresi dolar. Süresi dolan özet, form betiğine gelen ilk istekte ya da yaklaşık 10 dakikada bir çalışan otomatik temizlik göreviyle silinir.",
      en: "The hash is created only when a valid form submission is made and expires 10 minutes after the most recent valid submission. An expired hash is deleted on the next request to the form script or by an automated cleanup task that runs about every 10 minutes.",
    },
  },
} as const;

export function adresSatirlari(): [string, string] {
  const a = SITE.adres;
  return [`${a.mahalle}, ${a.cadde} ${a.kapiNo}`, `${a.postaKodu} ${a.ilce}/${a.il}`];
}

export function adresTekSatir(): string {
  return adresSatirlari().join(", ");
}
