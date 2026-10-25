import { KURULUS_YILI, kapasiteEn } from "./olgular.ts";
import type { Sozluk } from "./tr.ts";

function saat12(hhmm: string): string {
  const [s = 0, d = 0] = hhmm.split(":").map(Number);
  const dakika = d ? `:${String(d).padStart(2, "0")}` : "";
  return `${s % 12 || 12}${dakika} ${s < 12 ? "a.m." : "p.m."}`;
}

export const en: Sozluk = {
  dil: { ad: "English", kisa: "EN", ogLocale: "en_US" },
  genel: {
    atla: "Skip to content",
    logoAlt: "Hanedan Pilav home",
    navAria: "Main menu",
    dilAria: "Language",
    secili: "selected",
    telSr: "Phone:",
    menu: "Menu",
    kapat: "Close",
    menuAria: "Site menu",
    yeniSekme: " (opens in a new tab)",
  },
  nav: {
    kurumsal: "About",
    bayilerimiz: "Locations",
    galeri: "Gallery",
    iletisim: "Contact",
    bayilik: "Become a Franchisee",
  },
  wa: {
    etiket: "Chat on WhatsApp",
    aria: "Chat on WhatsApp (opens in a new tab)",
    mesaj: "Hello, I would like some information about Hanedan Pilav.",
  },
  saat: {
    etiket: "Hours",
    metin: (acilis, kapanis) => `Open daily, ${saat12(acilis)} to ${saat12(kapanis)}`,
  },
  alt: {
    slogan: "Lezzet Hanedanlığı",
    cumle: "pilaf restaurants, franchising, and catering.",
    olgular: [`Since ${KURULUS_YILI}`, `${kapasiteEn()} a day`.replace(/^./, (h) => h.toUpperCase()), "Locations across Istanbul"],
    merkez: "Headquarters",
    yolTarifi: "Directions",
    sayfalar: "Pages",
    iletisim: "Contact",
    kvkk: "Privacy Notice (KVKK)",
    cerez: "Cookie Policy",
    yasal: "Legal",
    telif: (yil) => `© ${KURULUS_YILI}-${yil} Hanedan Pilav. All rights reserved.`,
  },
  sayfalar: {
    kvkk: {
      meta: {
        baslik: "Privacy Notice (KVKK) · Hanedan Pilav",
        aciklama:
          "How Hanedan Pilav processes the personal data you send through the contact and franchise forms on this website, under Turkish Law No. 6698 (KVKK).",
      },
    },
    cerez: {
      meta: {
        baslik: "Cookie Policy · Hanedan Pilav",
        aciklama:
          "The Hanedan Pilav website uses no cookies, analytics, or third-party trackers. This policy explains the one technical record your browser keeps.",
      },
    },
    bulunamadi: {
      meta: {
        baslik: "Page Not Found · Hanedan Pilav",
        aciklama: "The page you are looking for could not be found.",
      },
      eylem: "Back to Homepage",
    },
  },
  seo: {
    anasayfa: "Home",
    ogGorselAlt: "Hanedan Pilav logo next to a plate of chicken and chickpea pilaf",
  },
  hata: {
    metaBaslik: "Error · Hanedan Pilav",
    etiket: "Error",
    baslik: "Something went wrong.",
    giris: "An unexpected error occurred while loading this page. Please refresh and try again.",
  },
};
