import { SITE, adresTekSatir } from "~/content/site.ts";
import type { Sozluk } from "~/i18n/index.ts";

export const TEL_HREF = `tel:${SITE.telefon.e164}`;

// Google Haritalar "Haritayı yerleştir" adresi: adres aramasıyla değil, işletmenin yer kaydıyla (pin) açılır.
export const GOOGLE_HARITA =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.8425213642436!2d28.893284599999998!3d41.0942873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab1b260569f41%3A0xc587246cd2778378!2sYunus%20Emre%2C%20Adem%20Yavuz%20Cd.%20No%3A76%2C%2034260%20Sultangazi%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1792876468728!5m2!1str!2str";

export const YOL_TARIFI = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresTekSatir())}`;

export function waHref(t: Sozluk): string {
  return `https://wa.me/${SITE.whatsapp.numara}?text=${encodeURIComponent(t.wa.mesaj)}`;
}

export function saatMetni(t: Sozluk): string {
  return t.saat.metin(SITE.calismaSaatleri.acilis, SITE.calismaSaatleri.kapanis);
}
