import type { Dil } from "~/lib/rotalar.ts";
import { useLang } from "./index.ts";

const tr = {
  meta: {
    baslik: "İletişim: Sultangazi adres ve WhatsApp · Hanedan Pilav",
    aciklama:
      "Hanedan Pilav’a telefon ve WhatsApp’tan ulaşın; Sultangazi’deki merkez adresimiz ve çalışma saatlerimiz burada. Şube açma ve toplu yemek için yazın.",
  },
  baslik: {
    etiket: "İletişim",
    baslik: "Bize ulaşın.",
    giris: "Sorularınız, şube açma ve toplu yemek talepleriniz için bizi arayabilir, WhatsApp’tan ya da form aracılığıyla yazabilirsiniz.",
  },
  bilgi: {
    baslik: "İletişim bilgileri",
    telefon: "Telefon",
    telefonAra: "Telefon:",
    whatsapp: "WhatsApp",
    whatsappEylem: "WhatsApp’tan yazın",
    eposta: "E-posta",
    saat: "Çalışma saatleri",
    adres: "Adres",
    yolTarifi: "Yol tarifi",
    yeniSekme: " (yeni sekmede açılır)",
    harita: {
      baslik: "Konumumuz",
      goster: "Haritayı göster",
      not: "Harita Google Haritalar’dan yüklenir; göstermeyi seçtiğinizde Google kendi çerezlerini kullanabilir.",
      cerceve: "Hanedan Pilav merkezinin Google Haritalar’daki konumu",
    },
  },
  form: {
    baslik: "Bize yazın",
    metin: "Formu doldurun; mesajınız en kısa sürede ilgili ekibe iletilir.",
  },
  yonlendirme: {
    baslik: "Şube açma ya da toplu yemek için mi yazıyorsunuz?",
    bayilik: {
      baslik: "Şube açma başvurusu",
      metin: "Şube açma hakkındaki bilgileri ve başvuru formunu Şubelerimiz sayfasında bulabilirsiniz.",
      eylem: "Şube açma bilgilerine git",
    },
    catering: {
      baslik: "Toplu yemek",
      metin: "Kurumsal toplu yemek hizmetimizin kapsamını Kurumsal sayfamızda bulabilirsiniz.",
      eylem: "Toplu yemek bilgilerine git",
    },
  },
};

export type IletisimSozluk = typeof tr;

const en: IletisimSozluk = {
  meta: {
    baslik: "Contact: Sultangazi address and WhatsApp · Hanedan Pilav",
    aciklama:
      "Reach Hanedan Pilav by phone or WhatsApp, or visit our Sultangazi, Istanbul headquarters. Send us your franchise inquiry or catering request online.",
  },
  baslik: {
    etiket: "Contact",
    baslik: "Get in touch.",
    giris: "Call us, message us on WhatsApp, or use the form for questions, franchise inquiries, and catering requests.",
  },
  bilgi: {
    baslik: "Contact details",
    telefon: "Phone",
    telefonAra: "Phone:",
    whatsapp: "WhatsApp",
    whatsappEylem: "Chat on WhatsApp",
    eposta: "Email",
    saat: "Hours",
    adres: "Address",
    yolTarifi: "Directions",
    yeniSekme: " (opens in a new tab)",
    harita: {
      baslik: "Find us",
      goster: "Show map",
      not: "The map loads from Google Maps; once you choose to show it, Google may use its own cookies.",
      cerceve: "Hanedan Pilav headquarters on Google Maps",
    },
  },
  form: {
    baslik: "Send us a message",
    metin: "Fill out the form and your message will reach the right team as soon as possible.",
  },
  yonlendirme: {
    baslik: "Writing about a franchise or catering?",
    bayilik: {
      baslik: "Franchise application",
      metin: "Franchise details and the application form are on our Locations page.",
      eylem: "See franchise details",
    },
    catering: {
      baslik: "Catering",
      metin: "You can read about our corporate catering service on our About page.",
      eylem: "See catering details",
    },
  },
};

const SOZLUKLER: Readonly<Record<Dil, IletisimSozluk>> = { tr, en };

export function iletisimSozluk(dil: Dil): IletisimSozluk {
  return SOZLUKLER[dil];
}

export function useIletisim(): IletisimSozluk {
  return iletisimSozluk(useLang());
}
