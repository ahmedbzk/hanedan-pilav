import { KURULUS_YILI, kapasiteTr, yilEki } from "./olgular.ts";

export const tr = {
  dil: { ad: "Türkçe", kisa: "TR", ogLocale: "tr_TR" },
  genel: {
    atla: "İçeriğe geç",
    logoAlt: "Hanedan Pilav ana sayfa",
    navAria: "Ana menü",
    dilAria: "Dil",
    secili: "seçili",
    telSr: "Telefon:",
    menu: "Menü",
    kapat: "Kapat",
    menuAria: "Site menüsü",
    yeniSekme: " (yeni sekmede açılır)",
  },
  nav: {
    kurumsal: "Kurumsal",
    bayilerimiz: "Şubelerimiz",
    galeri: "Galeri",
    iletisim: "İletişim",
    bayilik: "Şube Başvurusu",
  },
  wa: {
    etiket: "WhatsApp’tan yazın",
    aria: "WhatsApp’tan yazın (yeni sekmede açılır)",
    mesaj: "Merhaba, Hanedan Pilav hakkında bilgi almak istiyorum.",
  },
  saat: {
    etiket: "Çalışma saatleri",
    metin: (acilis: string, kapanis: string) => `Her gün ${acilis}-${kapanis}`,
  },
  alt: {
    slogan: "Lezzet Hanedanlığı",
    cumle: "pilav şubeleri, şube açma ve toplu yemek hizmeti.",
    olgular: [`${yilEki(KURULUS_YILI, "den")} beri`, `Günlük ${kapasiteTr()} üretim`, "İstanbul geneli şube ağı"],
    merkez: "Merkez",
    yolTarifi: "Yol tarifi",
    sayfalar: "Sayfalar",
    iletisim: "İletişim",
    kvkk: "KVKK Aydınlatma Metni",
    cerez: "Çerez Politikası",
    yasal: "Yasal",
    telif: (yil: number) => `© ${KURULUS_YILI}-${yil} Hanedan Pilav. Tüm hakları saklıdır.`,
  },
  sayfalar: {
    kvkk: {
      meta: {
        baslik: "KVKK Aydınlatma Metni · Hanedan Pilav",
        aciklama:
          "Hanedan Pilav web sitesindeki iletişim ve şube açma formlarıyla iletilen kişisel verilerin 6698 sayılı KVKK kapsamında işlenmesine dair aydınlatma metni.",
      },
    },
    cerez: {
      meta: {
        baslik: "Çerez Politikası · Hanedan Pilav",
        aciklama:
          "Hanedan Pilav web sitesi çerez, analitik veya üçüncü taraf takip aracı kullanmaz. Tarayıcınızda tutulan tek teknik kaydı bu politikada açıklıyoruz.",
      },
    },
    bulunamadi: {
      meta: {
        baslik: "Sayfa bulunamadı · Hanedan Pilav",
        aciklama: "Aradığınız sayfa bulunamadı.",
      },
      eylem: "Ana Sayfaya Dön",
    },
  },
  seo: {
    anasayfa: "Ana sayfa",
    ogGorselAlt: "Hanedan Pilav logosu ve tabakta tavuklu nohutlu pilav",
  },
  hata: {
    metaBaslik: "Hata · Hanedan Pilav",
    etiket: "Hata",
    baslik: "Bir sorun oluştu.",
    giris: "Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.",
  },
};

export type Sozluk = typeof tr;
