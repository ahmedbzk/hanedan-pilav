import { SITE, adresTekSatir } from "~/content/site.ts";
import type { Sozluk } from "~/i18n/index.ts";

export const TEL_HREF = `tel:${SITE.telefon.e164}`;

export const GOOGLE_HARITA = `https://www.google.com/maps?q=${encodeURIComponent(adresTekSatir())}&output=embed`;

export const YOL_TARIFI = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresTekSatir())}`;

export function waHref(t: Sozluk): string {
  return `https://wa.me/${SITE.whatsapp.numara}?text=${encodeURIComponent(t.wa.mesaj)}`;
}

export function saatMetni(t: Sozluk): string {
  return t.saat.metin(SITE.calismaSaatleri.acilis, SITE.calismaSaatleri.kapanis);
}
