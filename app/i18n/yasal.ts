import type { Dil, SayfaAnahtari } from "~/lib/rotalar.ts";
import { useLang } from "./index.ts";

export type Parca =
  | string
  | { readonly kalin: string }
  | { readonly sabit: "adres" | "telefon" | "eposta" | "ipSuresi" }
  | { readonly sayfa: SayfaAnahtari; readonly metin: string };
export type Satir = readonly Parca[];
export type Tanim = { readonly etiket: string; readonly deger: Satir };
export type Blok =
  | { readonly p: Satir }
  | { readonly not: Satir }
  | { readonly liste: readonly Satir[] }
  | { readonly tanimlar: readonly Tanim[]; readonly baslik?: string };
export type YasalBolum = { readonly id: string; readonly baslik: string; readonly bloklar: readonly Blok[] };

export const KVKK_BOLUMLERI = ["sorumlu", "veriler", "amaclar", "yontem", "aktarim", "saklama", "haklar", "basvuru"] as const;
export const CEREZ_BOLUMLERI = ["ozet", "tanim", "kullanilmayanlar", "depolama", "baglantilar", "yonetim", "sorular"] as const;
export type KvkkBolumu = (typeof KVKK_BOLUMLERI)[number];
export type CerezBolumu = (typeof CEREZ_BOLUMLERI)[number];

export type YasalSayfaMetni<K extends string> = {
  readonly etiket: string;
  readonly baslik: string;
  readonly giris: string;
  readonly bolumler: Readonly<Record<K, YasalBolum>>;
};

export type YasalSozluk = {
  readonly ortak: { readonly icindekiler: string };
  readonly kvkk: YasalSayfaMetni<KvkkBolumu>;
  readonly cerez: YasalSayfaMetni<CerezBolumu>;
};

const MD = "md. ";
const ART = "Article ";

export const yasalTr: YasalSozluk = {
  ortak: { icindekiler: "İçindekiler" },
  kvkk: {
    etiket: "Yasal",
    baslik: "KVKK Aydınlatma Metni",
    giris:
      "Bu metin, web sitemiz üzerinden bize ilettiğiniz kişisel verileri nasıl işlediğimizi 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (KVKK) 10. maddesi uyarınca açıklar.",
    bolumler: {
      sorumlu: {
        id: "veri-sorumlusu",
        baslik: "Veri sorumlusu",
        bloklar: [
          {
            p: [
              "Kişisel verileriniz, veri sorumlusu sıfatıyla Hanedan Pilav tarafından işlenir. Bu metin yalnız bu web sitesi üzerinden işlenen kişisel verileri kapsar.",
            ],
          },
          {
            tanimlar: [
              { etiket: "Veri sorumlusu", deger: ["Hanedan Pilav"] },
              { etiket: "Adres", deger: [{ sabit: "adres" }] },
              { etiket: "E-posta", deger: [{ sabit: "eposta" }] },
              { etiket: "Telefon", deger: [{ sabit: "telefon" }] },
            ],
          },
        ],
      },
      veriler: {
        id: "islenen-veriler",
        baslik: "İşlenen kişisel veriler",
        bloklar: [
          {
            p: [
              "Sitemizde üyelik, kullanıcı hesabı veya çevrim içi satış yoktur. Formlardan birini gönderdiğinizde paylaştığınız bilgileri ve siteyi ziyaret ettiğinizde oluşan teknik kayıtları işleriz.",
            ],
          },
          {
            tanimlar: [
              {
                etiket: "İletişim formu",
                deger: ["Ad soyad, telefon numarası, e-posta adresi, firma adı (isteğe bağlı), seçtiğiniz konu ve mesajınız."],
              },
              {
                etiket: "Şube açma başvuru formu",
                deger: [
                  "Ad soyad, telefon numarası, e-posta adresi ve seçtiğiniz ilçe; isteğe bağlı olarak mevcut bir işletmeniz olup olmadığı, düşündüğünüz bölge ve mesajınız.",
                ],
              },
              {
                etiket: "IP adresi özeti",
                deger: [
                  "Form gönderdiğinizde, formların kötüye kullanılmasını önlemek için IP adresinizden tek yönlü bir özet üretilir. IP adresinizin kendisi bu amaçla kaydedilmez.",
                ],
              },
              {
                etiket: "Sunucu kayıtları",
                deger: [
                  "Siteyi ziyaret ettiğinizde barındırma sunucusu; IP adresi, tarih ve saat, istenen sayfa ve tarayıcı bilgilerinden oluşan erişim kayıtlarını otomatik olarak tutar.",
                ],
              },
            ],
          },
          {
            not: [
              "Lütfen mesajlarınıza sağlık, din veya etnik köken gibi özel nitelikli kişisel veriler yazmayın. Talebinizi yanıtlamak için bu bilgilere ihtiyacımız yoktur.",
            ],
          },
        ],
      },
      amaclar: {
        id: "amaclar-ve-hukuki-sebepler",
        baslik: "İşleme amaçları ve hukuki sebepler",
        bloklar: [
          { p: [`Kişisel verilerinizi yalnız aşağıdaki amaçlarla ve KVKK ${MD}5/2’deki hukuki sebeplere dayanarak işleriz:`] },
          {
            liste: [
              [
                { kalin: "İletişim talebinizi yanıtlamak. " },
                `Sipariş, toplu yemek veya teklif taleplerinde sözleşmenin kurulması ve ifası (${MD}5/2-c); diğer soru ve önerilerde meşru menfaatimiz (${MD}5/2-f).`,
              ],
              [
                { kalin: "Şube açma başvurunuzu değerlendirmek ve sizinle görüşmek. " },
                `Şube açma sözleşmesinin kurulmasıyla doğrudan ilgili olması (${MD}5/2-c).`,
              ],
              [
                { kalin: "Formların kötüye kullanılmasını önlemek ve site güvenliğini sağlamak. " },
                `Meşru menfaatimiz (${MD}5/2-f).`,
              ],
              [
                { kalin: "Hukuki yükümlülüklerimizi yerine getirmek. " },
                `5651 sayılı Kanun dâhil mevzuatın gerektirdiği erişim kayıtlarını tutmak ve yetkili kamu kurumlarının usulüne uygun taleplerini karşılamak (${MD}5/2-ç).`,
              ],
            ],
          },
          { p: ["Bu amaçların hiçbiri için açık rızanızı istemeyiz. Verilerinizi reklam veya pazarlama amacıyla kullanmayız."] },
        ],
      },
      yontem: {
        id: "toplama-yontemi",
        baslik: "Toplama yöntemi",
        bloklar: [
          {
            p: [
              "Verileriniz elektronik ortamda ve otomatik yolla toplanır: form bilgileri, sitemizdeki formları doldurup göndermenizle; sunucu kayıtları ise siteyi ziyaret ettiğinizde sunucu tarafından. Formlar sitemizin kendi sunucusunda işlenir; gönderdiğiniz bilgiler bir veritabanına kaydedilmez, yalnız e-posta olarak ilgili ekibimize iletilir.",
            ],
          },
        ],
      },
      aktarim: {
        id: "aktarim",
        baslik: "Kişisel verilerin aktarılması",
        bloklar: [
          {
            p: [
              `Verilerinizi satmayız. KVKK ${MD}8 ve ${MD}9’a uygun olarak, yalnız yukarıdaki amaçlar için gerektiği ölçüde şu alıcılarla paylaşırız:`,
            ],
          },
          {
            tanimlar: [
              { etiket: "Barındırma sağlayıcısı", deger: ["Web sitemizi barındıran hizmet sağlayıcı (sitenin ve formların çalıştığı sunucu)."] },
              { etiket: "E-posta sağlayıcısı", deger: ["Form içeriğini bize ileten e-posta hizmeti sağlayıcısı. Sunucuları yurt dışında bulunabilir."] },
              {
                etiket: "Yetkili kamu kurumları",
                deger: ["Yalnız kanunen yetkili bir merciin usulüne uygun talebi olduğunda ve bu taleple sınırlı olarak."],
              },
            ],
          },
          {
            p: [
              { kalin: "Yurt dışına aktarım: " },
              `E-posta sağlayıcımızın sunucuları yurt dışında bulunabileceğinden form içeriğiniz yurt dışına aktarılabilir. Bu aktarım, KVKK ${MD}9’a uygun olarak Kanun’un öngördüğü uygun güvencelerden biri sağlanarak yapılır.`,
            ],
          },
          {
            p: [
              { kalin: "İletişim sayfasındaki harita: " },
              "Haritayı göstermeyi seçerseniz harita doğrudan Google’dan yüklenir; IP adresiniz ve tarayıcı bilgileriniz Google’a iletilir. Bu veriler için veri sorumlusu Google’dır ve Google’ın gizlilik politikası geçerlidir.",
            ],
          },
        ],
      },
      saklama: {
        id: "saklama-suresi",
        baslik: "Saklama süresi",
        bloklar: [
          { p: ["Verilerinizi yalnız işlendikleri amaç için gereken süre ve mevzuatın öngördüğü süreler boyunca saklarız."] },
          {
            tanimlar: [
              {
                etiket: "Form e-postaları",
                deger: [
                  "Talebinizi yanıtlamak ve varsa sonrasındaki ilişkiyi yürütmek için gerektiği sürece, en fazla talebin sonuçlanmasından itibaren 2 yıl. Mevzuat daha uzun bir saklama süresi öngörüyorsa o süre uygulanır.",
                ],
              },
              { etiket: "IP adresi özeti", deger: [{ sabit: "ipSuresi" }] },
              { etiket: "Sunucu kayıtları", deger: ["Mevzuatın öngördüğü süre boyunca."] },
            ],
          },
          {
            p: [
              `Süre dolduğunda veya işleme sebebi ortadan kalktığında verileriniz KVKK ${MD}7 uyarınca silinir, yok edilir veya anonim hâle getirilir.`,
            ],
          },
        ],
      },
      haklar: {
        id: "haklariniz",
        baslik: "Haklarınız",
        bloklar: [
          { p: [`KVKK ${MD}11 uyarınca bize başvurarak şu haklarınızı kullanabilirsiniz:`] },
          {
            liste: [
              ["Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi isteme"],
              ["İşlenme amacını ve verilerin bu amaca uygun kullanılıp kullanılmadığını öğrenme"],
              ["Verilerinizin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme"],
              ["Eksik veya yanlış işlenen verilerin düzeltilmesini isteme"],
              [`KVKK ${MD}7’deki şartlar çerçevesinde verilerinizin silinmesini veya yok edilmesini isteme`],
              ["Düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme"],
              ["Yalnız otomatik sistemlerle yapılan analiz sonucunda aleyhinize bir sonuç çıkmasına itiraz etme"],
              ["Verilerinizin kanuna aykırı işlenmesi nedeniyle uğradığınız zararın giderilmesini isteme"],
            ],
          },
        ],
      },
      basvuru: {
        id: "basvuru",
        baslik: "Başvuru yolu",
        bloklar: [
          { p: ["Haklarınızla ilgili taleplerinizi şu yollardan biriyle bize iletebilirsiniz:"] },
          {
            tanimlar: [
              { etiket: "E-posta", deger: [{ sabit: "eposta" }] },
              { etiket: "Posta veya elden teslim", deger: [{ sabit: "adres" }] },
            ],
          },
          {
            p: [
              "Başvurunuzda adınızı ve soyadınızı, size ulaşabileceğimiz bir iletişim bilgisini ve talebinizi belirtmeniz yeterlidir. Verilerin yanlış kişiye verilmemesi için talebin size ait olduğunu iletişim bilgileriniz üzerinden teyit edebiliriz.",
            ],
          },
          {
            p: [
              "Başvurunuzu en geç otuz gün içinde ücretsiz olarak sonuçlandırırız. İşlem ayrıca bir maliyet gerektirirse, Kişisel Verileri Koruma Kurulunun belirlediği tarifedeki ücret alınabilir.",
            ],
          },
          {
            p: [
              `Başvurunuz reddedilirse, yanıtımızı yetersiz bulursanız veya süresinde yanıt alamazsanız, yanıtı öğrendiğiniz tarihten itibaren otuz gün ve her durumda başvuru tarihinden itibaren altmış gün içinde Kişisel Verileri Koruma Kuruluna şikâyette bulunabilirsiniz (KVKK ${MD}14).`,
            ],
          },
        ],
      },
    },
  },
  cerez: {
    etiket: "Yasal",
    baslik: "Çerez Politikası",
    giris:
      "Bu sayfa, sitemizi ziyaret ettiğinizde tarayıcınızda neyin saklandığını açıklar. Kısaca: sitemiz çerez kullanmaz ve sizi izlemez.",
    bolumler: {
      ozet: {
        id: "ozet",
        baslik: "Özet",
        bloklar: [
          {
            liste: [
              ["Sitemiz tarayıcınıza çerez yazmaz."],
              ["Analitik, reklam veya sosyal medya takip aracı kullanılmaz."],
              ["Yazı tipleri dâhil tüm dosyalar sitemizin kendi sunucusundan yüklenir; sayfalar kendiliğinden üçüncü taraflara istek göndermez."],
              [
                "Tek istisna İletişim sayfasındaki haritadır: “Haritayı göster” düğmesine tıklarsanız harita Google’dan yüklenir ve Google kendi çerezlerini yazabilir.",
              ],
              ["Gezinirken tarayıcınız, sayfada kaldığınız yere dönebilmeniz için kısa ömürlü teknik bir kayıt tutar."],
            ],
          },
        ],
      },
      tanim: {
        id: "cerez-nedir",
        baslik: "Çerez nedir?",
        bloklar: [
          {
            p: [
              "Çerezler, bir web sitesinin tarayıcınıza kaydettiği ve sonraki ziyaretlerde siteye geri gönderilen küçük metin dosyalarıdır. Oturum açık tutma, tercih hatırlama, ziyaretçi sayma veya reklam hedefleme gibi amaçlarla kullanılır.",
            ],
          },
          {
            p: [
              "Tarayıcıların yerel depolaması ve oturum depolaması da cihazınızda veri tutar; çerezlerden farkı, bu verilerin sunucuya kendiliğinden gönderilmemesidir.",
            ],
          },
        ],
      },
      kullanilmayanlar: {
        id: "kullanmadiklarimiz",
        baslik: "Bu sitede neler yok?",
        bloklar: [
          {
            liste: [
              [{ kalin: "Çerez: " }, "Sitemiz çerez yazmaz; haritayı açmadığınız sürece üçüncü taraf çerez de oluşmaz."],
              [{ kalin: "Analitik: " }, "Ziyaretçi sayan veya davranış izleyen bir araç yoktur."],
              [{ kalin: "Reklam: " }, "Reklam, yeniden hedefleme veya dönüşüm takibi yoktur."],
              [
                { kalin: "Üçüncü taraf içerik: " },
                "Sosyal medya eklentisi veya gömülü video yoktur. Google Haritalar dışında üçüncü taraf içerik yoktur; o da yalnız siz isterseniz yüklenir.",
              ],
              [
                { kalin: "Harita: " },
                "İletişim sayfasındaki harita önce sitemizden yüklenen bir önizleme olarak görünür ve bu aşamada Google’a istek gönderilmez. “Haritayı göster” düğmesine tıkladığınızda Google Haritalar yüklenir; IP adresiniz ve tarayıcı bilgileriniz Google’a iletilir ve Google, kendi gizlilik politikası kapsamında çerez yazabilir.",
              ],
            ],
          },
        ],
      },
      depolama: {
        id: "tarayici-depolamasi",
        baslik: "Tarayıcıda saklanan kayıt",
        bloklar: [
          {
            p: [
              "Siteyi gezerken tarayıcınız, bir sayfaya geri döndüğünüzde kaldığınız yere dönebilmeniz için oturum depolamasında teknik bir kayıt tutar. Bu kayıt sizi tanımlamaz, hiçbir yere gönderilmez ve sekmeyi kapattığınızda silinir.",
            ],
          },
        ],
      },
      baglantilar: {
        id: "dis-baglantilar",
        baslik: "Dış bağlantılar",
        bloklar: [
          {
            p: [
              "Sitede WhatsApp, telefonla arama ve Google Haritalar yol tarifi gibi dış hizmetlere giden bağlantılar vardır. Bu bağlantılara tıklamadığınız sürece bu hizmetlere hiçbir istek gönderilmez. Tıkladığınızda ilgili hizmete geçersiniz ve orada o hizmetin kendi çerez ve gizlilik politikaları geçerli olur.",
            ],
          },
        ],
      },
      yonetim: {
        id: "tercihleriniz",
        baslik: "Tercihleriniz",
        bloklar: [
          {
            p: [
              "Sitemiz çerez kullanmadığı için onay vermeniz gereken bir çerez tercihi yoktur. Google’a hiç istek gönderilmesin istiyorsanız İletişim sayfasındaki haritayı göstermemeniz yeterlidir; haritayı açtıktan sonra Google’ın yazdığı çerezleri tarayıcı ayarlarınızdan silebilir veya engelleyebilirsiniz.",
            ],
          },
          {
            p: [
              "Tarayıcınızın tuttuğu teknik kaydı da site verileri ayarlarından silebilirsiniz; site çalışmaya devam eder, yalnız geri döndüğünüz sayfada kaldığınız yer hatırlanmaz.",
            ],
          },
        ],
      },
      sorular: {
        id: "sorular",
        baslik: "Sorularınız",
        bloklar: [
          {
            p: [
              "Formlar aracılığıyla işlenen kişisel veriler, sunucu kayıtları ve haklarınız için ",
              { sayfa: "kvkk", metin: "KVKK Aydınlatma Metni" },
              "’ne, diğer sorularınız için ",
              { sayfa: "iletisim", metin: "İletişim" },
              " sayfasına bakabilirsiniz. Bu politika değişirse güncel hâli bu sayfada yayımlanır.",
            ],
          },
        ],
      },
    },
  },
};

export const yasalEn: YasalSozluk = {
  ortak: { icindekiler: "Contents" },
  kvkk: {
    etiket: "Legal",
    baslik: "Privacy Notice",
    giris:
      "This notice explains how we process the personal data you share with us through this website, as required by Article 10 of Turkish Law No. 6698 on the Protection of Personal Data (“KVKK”).",
    bolumler: {
      sorumlu: {
        id: "data-controller",
        baslik: "Data controller",
        bloklar: [
          {
            p: [
              "Your personal data is processed by Hanedan Pilav as the data controller. This notice covers only personal data processed through this website.",
            ],
          },
          {
            tanimlar: [
              { etiket: "Data controller", deger: ["Hanedan Pilav"] },
              { etiket: "Address", deger: [{ sabit: "adres" }] },
              { etiket: "Email", deger: [{ sabit: "eposta" }] },
              { etiket: "Phone", deger: [{ sabit: "telefon" }] },
            ],
          },
        ],
      },
      veriler: {
        id: "data-we-process",
        baslik: "Personal data we process",
        bloklar: [
          {
            p: [
              "This website has no memberships, user accounts, or online sales. We process the information you share when you submit one of our forms, and the technical records created when you visit the site.",
            ],
          },
          {
            tanimlar: [
              {
                etiket: "Contact form",
                deger: ["Full name, phone number, email address, company name (optional), the subject you select, and your message."],
              },
              {
                etiket: "Franchise application form",
                deger: [
                  "Full name, phone number, email address, and the district you select; optionally, whether you currently run a business, the location you have in mind, and your message.",
                ],
              },
              {
                etiket: "IP address hash",
                deger: [
                  "When you submit a form, a one-way hash is derived from your IP address to prevent abuse of the forms. Your IP address itself is not stored for this purpose.",
                ],
              },
              {
                etiket: "Server logs",
                deger: [
                  "When you visit the site, the hosting server automatically keeps access logs consisting of your IP address, the date and time, the page requested, and browser information.",
                ],
              },
            ],
          },
          {
            not: [
              "Please do not include special categories of personal data, such as health information, religious beliefs, or ethnic origin, in your messages. We do not need this information to respond to you.",
            ],
          },
        ],
      },
      amaclar: {
        id: "purposes-and-legal-bases",
        baslik: "Purposes and legal bases",
        bloklar: [
          { p: [`We process your personal data only for the purposes below, each based on a legal ground under ${ART}5(2) of the KVKK:`] },
          {
            liste: [
              [
                { kalin: "Responding to your inquiry. " },
                `For orders, catering, or quote requests, the establishment and performance of a contract (${ART}5(2)(c)); for other questions and feedback, our legitimate interests (${ART}5(2)(f)).`,
              ],
              [
                { kalin: "Reviewing your franchise application and following up with you. " },
                `Processing is directly related to establishing a franchise agreement (${ART}5(2)(c)).`,
              ],
              [{ kalin: "Preventing form abuse and keeping the site secure. " }, `Our legitimate interests (${ART}5(2)(f)).`],
              [
                { kalin: "Meeting our legal obligations. " },
                `Keeping the access logs required by law, including Law No. 5651, and responding to lawful requests from competent public authorities (${ART}5(2)(ç)).`,
              ],
            ],
          },
          { p: ["We do not ask for your explicit consent for any of these purposes. We do not use your data for advertising or marketing."] },
        ],
      },
      yontem: {
        id: "how-we-collect",
        baslik: "How we collect your data",
        bloklar: [
          {
            p: [
              "We collect your data electronically and by automated means: form details when you fill out and submit a form on this website, and server logs when you visit the site. The forms are handled on this website’s own server; your submission is not stored in a database and is only forwarded by email to the relevant team.",
            ],
          },
        ],
      },
      aktarim: {
        id: "sharing",
        baslik: "Who we share your data with",
        bloklar: [
          {
            p: [
              `We do not sell your data. In line with ${ART}8 and ${ART}9 of the KVKK, we share it only with the following recipients, and only as needed for the purposes above:`,
            ],
          },
          {
            tanimlar: [
              { etiket: "Hosting provider", deger: ["The service provider that hosts our website (the server that runs the site and its forms)."] },
              { etiket: "Email provider", deger: ["The email service provider that delivers form submissions to us. Its servers may be located abroad."] },
              {
                etiket: "Public authorities",
                deger: ["Only when a legally authorized authority makes a valid request, and only to the extent of that request."],
              },
            ],
          },
          {
            p: [
              { kalin: "Transfers abroad: " },
              `Because our email provider’s servers may be located abroad, your form submission may be transferred abroad. Any such transfer is made in line with ${ART}9 of the KVKK, relying on one of the appropriate safeguards provided by the law.`,
            ],
          },
          {
            p: [
              { kalin: "Map on the Contact page: " },
              "If you choose to show the map, it loads directly from Google, and your IP address and browser information are sent to Google. Google is the data controller for this data, and Google’s privacy policy applies.",
            ],
          },
        ],
      },
      saklama: {
        id: "retention",
        baslik: "How long we keep your data",
        bloklar: [
          { p: ["We keep your data only for as long as its purpose requires and for any period required by law."] },
          {
            tanimlar: [
              {
                etiket: "Form emails",
                deger: [
                  "For as long as needed to respond to your request and manage any relationship that follows, and no longer than 2 years after the request is concluded, unless the law requires a longer retention period.",
                ],
              },
              { etiket: "IP address hash", deger: [{ sabit: "ipSuresi" }] },
              { etiket: "Server logs", deger: ["For the period required by law."] },
            ],
          },
          {
            p: [
              `When that period ends, or the reason for processing no longer applies, we delete, destroy, or anonymize your data in accordance with ${ART}7 of the KVKK.`,
            ],
          },
        ],
      },
      haklar: {
        id: "your-rights",
        baslik: "Your rights",
        bloklar: [
          { p: [`Under ${ART}11 of the KVKK, you can contact us to:`] },
          {
            liste: [
              ["Find out whether your personal data is processed and, if so, request information about it"],
              ["Learn the purpose of the processing and whether your data is used in line with that purpose"],
              ["Know the third parties in Türkiye or abroad to whom your data has been transferred"],
              ["Request correction of incomplete or inaccurate data"],
              [`Request deletion or destruction of your data under the conditions in ${ART}7 of the KVKK`],
              ["Request that any correction, deletion, or destruction be communicated to the third parties who received your data"],
              ["Object to an outcome against you that results solely from automated analysis"],
              ["Claim compensation for damage caused by unlawful processing of your data"],
            ],
          },
        ],
      },
      basvuru: {
        id: "how-to-apply",
        baslik: "How to submit a request",
        bloklar: [
          { p: ["You can send requests about your rights through either of these channels:"] },
          {
            tanimlar: [
              { etiket: "Email", deger: [{ sabit: "eposta" }] },
              { etiket: "Mail or in person", deger: [{ sabit: "adres" }] },
            ],
          },
          {
            p: [
              "Your request only needs your full name, a way for us to contact you, and what you are asking for. To make sure your data is not disclosed to the wrong person, we may confirm through your contact details that the request is yours.",
            ],
          },
          {
            p: [
              "We will respond free of charge within thirty days at the latest. If handling your request involves an additional cost, we may charge the fee set by the Personal Data Protection Board.",
            ],
          },
          {
            p: [
              `If your request is rejected, you find our response insufficient, or we do not respond in time, you may file a complaint with the Personal Data Protection Board within thirty days of learning of our response, and in any case within sixty days of your request (KVKK ${ART}14).`,
            ],
          },
        ],
      },
    },
  },
  cerez: {
    etiket: "Legal",
    baslik: "Cookie Policy",
    giris:
      "This page explains what is stored in your browser when you visit our website. In short: our site does not use cookies and does not track you.",
    bolumler: {
      ozet: {
        id: "at-a-glance",
        baslik: "At a glance",
        bloklar: [
          {
            liste: [
              ["Our site does not set cookies in your browser."],
              ["No analytics, advertising, or social media tracking tools are used."],
              ["All files, including fonts, load from our own server; pages send no requests to third parties on their own."],
              [
                "The one exception is the map on the Contact page: if you select “Show map,” the map loads from Google, and Google may set its own cookies.",
              ],
              ["While you browse, your browser keeps a short-lived technical record so you can return to where you were on a page."],
            ],
          },
        ],
      },
      tanim: {
        id: "what-are-cookies",
        baslik: "What are cookies?",
        bloklar: [
          {
            p: [
              "Cookies are small text files that a website saves in your browser and that are sent back to the site on later visits. They are used to keep you signed in, remember preferences, count visitors, or target ads.",
            ],
          },
          {
            p: [
              "Browsers also offer local storage and session storage, which keep data on your device. Unlike cookies, this data is not sent to the server automatically.",
            ],
          },
        ],
      },
      kullanilmayanlar: {
        id: "what-we-dont-use",
        baslik: "What this site doesn’t use",
        bloklar: [
          {
            liste: [
              [{ kalin: "Cookies: " }, "Our site sets no cookies, and no third-party cookies are created unless you open the map."],
              [{ kalin: "Analytics: " }, "There is no tool that counts visitors or tracks behavior."],
              [{ kalin: "Advertising: " }, "There is no advertising, retargeting, or conversion tracking."],
              [
                { kalin: "Third-party content: " },
                "There are no social media plugins or embedded videos. Google Maps is the only third-party content, and it loads only if you ask for it.",
              ],
              [
                { kalin: "Map: " },
                "The map on the Contact page first appears as a preview served from our site, and no request is sent to Google at that point. When you select “Show map,” Google Maps loads; your IP address and browser information are sent to Google, and Google may set cookies under its own privacy policy.",
              ],
            ],
          },
        ],
      },
      depolama: {
        id: "browser-storage",
        baslik: "What is stored in your browser",
        bloklar: [
          {
            p: [
              "While you browse the site, your browser keeps a technical record in session storage so you can return to where you were when you go back to a page. It does not identify you, is never sent anywhere, and is deleted when you close the tab.",
            ],
          },
        ],
      },
      baglantilar: {
        id: "external-links",
        baslik: "External links",
        bloklar: [
          {
            p: [
              "This site links to outside services such as WhatsApp, phone calls, and Google Maps directions. No requests are sent to these services unless you select one of these links. When you do, you move to that service, where its own cookie and privacy policies apply.",
            ],
          },
        ],
      },
      yonetim: {
        id: "your-choices",
        baslik: "Your choices",
        bloklar: [
          {
            p: [
              "Because our site uses no cookies, there is no cookie consent to give. If you don’t want any request sent to Google, simply don’t show the map on the Contact page; if you have opened it, you can delete or block Google’s cookies in your browser settings.",
            ],
          },
          {
            p: [
              "You can also delete the browser’s technical record in your site data settings; the site keeps working, it just won’t remember where you were when you go back to a page.",
            ],
          },
        ],
      },
      sorular: {
        id: "questions",
        baslik: "Questions",
        bloklar: [
          {
            p: [
              "For the personal data processed through our forms, server logs, and your rights, see our ",
              { sayfa: "kvkk", metin: "Privacy Notice" },
              ". For anything else, see our ",
              { sayfa: "iletisim", metin: "Contact" },
              " page. If this policy changes, the updated version will be posted on this page.",
            ],
          },
        ],
      },
    },
  },
};

const SOZLUKLER: Readonly<Record<Dil, YasalSozluk>> = { tr: yasalTr, en: yasalEn };

export function yasalSozluk(dil: Dil): YasalSozluk {
  return SOZLUKLER[dil];
}

export function useYasal(): YasalSozluk {
  return yasalSozluk(useLang());
}
