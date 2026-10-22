import type { Dil } from "~/lib/rotalar.ts";
import { useLang } from "./index.ts";
import { KURULUS_YILI, kapasiteEn, kapasiteTr, metrikTon, yilEki } from "./olgular.ts";

const tr = {
  meta: {
    baslik: "Kurumsal: pilav üretimi ve toplu yemek · Hanedan Pilav",
    aciklama:
      `${yilEki(KURULUS_YILI, "den")} bu yana Sultangazi’deki mutfağımızda günlük ${kapasiteTr(" ")} üretim kapasitesi, titiz hijyen standartları ve firmalara toplu yemek, catering hizmeti.`,
  },
  baslik: {
    etiket: "Kurumsal",
    baslik: "Geleneksel lezzet, modern üretim.",
    giris: "Hanedan Pilav, kuruluşundan bu yana gıda sektöründe köklü bir güven markası hâline geldi.",
  },
  hikaye: {
    baslik: "Geleneksel Lezzet, Güvenilir Operasyon ve Kurumsal Gelecek",
    paragraflar: [
      "1998 yılında temelleri atılan Hanedan Pilav, geleneksel lezzet anlayışını modern üretim standartlarıyla birleştirerek gıda sektöründe köklü bir güven markası haline gelmiştir. Günlük 1 tonluk üretim kapasitemiz ve İstanbul genelini kapsayan güçlü lojistik ağımız sayesinde; kurumsal firmalara, toplu organizasyonlara ve şube iş ortaklarımıza profesyonel, sürdürülebilir ve yüksek kalite standartlarında çözümler sunuyoruz. Lezzet, hijyen ve operasyonel sürekliliği ön planda tutan iş modelimizle; yatırımcılarımıza ve iş ortaklarımıza İstanbul genelinde güvenilir, verimli ve uzun vadeli bir iş ortaklığı deneyimi sağlamaya devam ediyoruz.",
    ],
    kunye: {
      baslik: "Kısaca Hanedan Pilav",
      kurulus: "Kuruluş",
      merkez: "Merkez",
      kapasite: "Günlük üretim kapasitesi",
      kapasiteDeger: (miktar: number) => `${miktar}\u00a0ton`,
      hizmetAlani: "Hizmet alanı",
      hizmetAlaniDeger: "İstanbul geneli",
    },
  },
  calisma: {
    baslik: "Nasıl çalışıyoruz?",
    maddeler: {
      uretim: {
        baslik: "Yüksek kapasiteli üretim",
        metin: `Günlük ${kapasiteTr()} üretim kapasitemiz, şubelerimizin ve toplu yemek siparişlerinin ihtiyacını birlikte karşılar.`,
      },
      hijyen: {
        baslik: "Titiz hijyen standartları",
        metin: "Yüksek hacimde üretirken temizlik kurallarından taviz vermiyor, onları üretimin her aşamasında uyguluyoruz.",
      },
      lojistik: {
        baslik: "Şube ve lojistik ağı",
        metin: "Şubelerimiz ve lojistik ağımız sayesinde İstanbul genelinde hizmet verebiliyoruz.",
      },
    },
  },
  catering: {
    baslik: "Toplu yemek ve organizasyon.",
    metin: "Yüksek üretim kapasitemizle profesyonel ve güvenilir toplu yemek çözümleri sunuyoruz.",
    alanlarBaslik: "Hizmet verdiğimiz alanlar",
    alanlar: {
      kurumsal: "Kurumsal firmalar",
      toplu: "Toplu yemekler",
      organizasyon: "Organizasyonlar",
    },
    eylem: "Toplu Yemek Teklifi",
  },
  degerler: {
    baslik: "Neye önem veriyoruz?",
    maddeler: {
      lezzet: { baslik: "Lezzet", metin: "Geleneksel pişirme anlayışından ödün vermeyen bir mutfak." },
      hijyen: { baslik: "Hijyen", metin: "Mutfakta temizlik ve düzen, her gün aynı titizlikle uygulanır." },
      sureklilik: {
        baslik: "Süreklilik",
        metin: "Her gün aynı lezzeti sunabilmek için üretimde ve lojistikte sürekliliği önceliyoruz.",
      },
    },
  },
  kapanis: {
    baslik: "Kendi Hanedan Pilav şubenizi açın.",
    metin: "Şube açma başvurusuyla ilgili bilgiler Şubelerimiz sayfasında.",
  },
};

export type KurumsalSozluk = typeof tr;

const en: KurumsalSozluk = {
  meta: {
    baslik: "About us: pilaf production and catering · Hanedan Pilav",
    aciklama:
      `Since ${KURULUS_YILI}, our Sultangazi kitchen in Istanbul: ${kapasiteEn(" ")} of daily production capacity, rigorous hygiene standards, and catering for companies and events.`,
  },
  baslik: {
    etiket: "About us",
    baslik: "Traditional flavor, modern production.",
    giris: "Since its founding, Hanedan Pilav has grown into a long-trusted name in the food industry.",
  },
  hikaye: {
    baslik: "Traditional Flavor, Reliable Operations and a Corporate Future",
    paragraflar: [
      "Founded in 1998, Hanedan Pilav has combined a traditional approach to flavor with modern production standards and grown into a long-trusted name in the food industry. With a daily production capacity of 1 ton and a strong logistics network covering all of Istanbul, we offer professional, sustainable, high-quality solutions to corporate companies, large events and our franchise partners. With a business model that puts flavor, hygiene and operational continuity first, we continue to give our investors and partners a reliable, efficient and long-term partnership across Istanbul.",
    ],
    kunye: {
      baslik: "Hanedan Pilav at a glance",
      kurulus: "Founded",
      merkez: "Headquarters",
      kapasite: "Daily production capacity",
      kapasiteDeger: metrikTon,
      hizmetAlani: "Service area",
      hizmetAlaniDeger: "Across Istanbul",
    },
  },
  calisma: {
    baslik: "How we work.",
    maddeler: {
      uretim: {
        baslik: "High-capacity production",
        metin: `Our daily production capacity of ${kapasiteEn()} covers our locations and large catering orders alike.`,
      },
      hijyen: {
        baslik: "Rigorous hygiene standards",
        metin: "Volume never comes at the expense of cleanliness. We apply our standards at every stage of production.",
      },
      lojistik: {
        baslik: "Locations and logistics network",
        metin: "Our network of locations and logistics lets us serve customers across Istanbul.",
      },
    },
  },
  catering: {
    baslik: "Catering and events.",
    metin: "Backed by high production capacity, we offer professional, dependable catering.",
    alanlarBaslik: "Who we serve",
    alanlar: {
      kurumsal: "Corporate clients",
      toplu: "Group meals",
      organizasyon: "Events",
    },
    eylem: "Get a Catering Quote",
  },
  degerler: {
    baslik: "What we stand for.",
    maddeler: {
      lezzet: { baslik: "Flavor", metin: "A kitchen that stays true to traditional cooking." },
      hijyen: { baslik: "Hygiene", metin: "Cleanliness and order, kept with the same care every single day." },
      sureklilik: {
        baslik: "Continuity",
        metin: "Steady production and logistics, so the flavor you get today is the flavor you get tomorrow.",
      },
    },
  },
  kapanis: {
    baslik: "Open your own Hanedan Pilav location.",
    metin: "Details on how to apply are on our Locations page.",
  },
};

const SOZLUKLER: Readonly<Record<Dil, KurumsalSozluk>> = { tr, en };

export function kurumsalSozluk(dil: Dil): KurumsalSozluk {
  return SOZLUKLER[dil];
}

export function useKurumsal(): KurumsalSozluk {
  return kurumsalSozluk(useLang());
}
