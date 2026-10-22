import type { Icon } from "@phosphor-icons/react";
import { ClockIcon } from "@phosphor-icons/react/Clock";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/EnvelopeSimple";
import { InstagramLogoIcon } from "@phosphor-icons/react/InstagramLogo";
import { MapPinIcon } from "@phosphor-icons/react/MapPin";
import { NavigationArrowIcon } from "@phosphor-icons/react/NavigationArrow";
import { PhoneIcon } from "@phosphor-icons/react/Phone";
import type { ReactNode } from "react";
import { Buton } from "~/components/Buton.tsx";
import { Ikon } from "~/components/Ikon.tsx";
import { WhatsAppGlyph } from "~/components/WhatsApp.tsx";
import { SITE, adresSatirlari } from "~/content/site.ts";
import { useT } from "~/i18n/index.ts";
import { useIletisim } from "~/i18n/iletisim.ts";
import { cx } from "~/lib/cx.ts";
import { TEL_HREF, YOL_TARIFI, saatMetni, waHref } from "~/lib/iletisim.ts";
import s from "./Bilgiler.module.css";
import { KonumHaritasi } from "./KonumHaritasi.tsx";

type SatirProps = { ikon: Icon | "wa"; etiket: string; ton?: "wa" | "insta"; children: ReactNode };

function Satir({ ikon, etiket, ton, children }: SatirProps) {
  return (
    <div className={s.satir}>
      <span className={cx(s.rozet, ton === "wa" && s.rozetWa, ton === "insta" && s.rozetInsta)} aria-hidden="true">
        {ikon === "wa" ? <WhatsAppGlyph className={s.glif} /> : <Ikon ikon={ikon} className={s.glif} />}
      </span>
      <dt>{etiket}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function Bilgiler() {
  const t = useT();
  const m = useIletisim().bilgi;
  const [adres1, adres2] = adresSatirlari();
  return (
    <div className={s.kolon}>
      <h2 className="sr">{m.baslik}</h2>
      <dl className={s.liste}>
        <Satir ikon={PhoneIcon} etiket={m.telefon}>
          <a className={s.telefon} href={TEL_HREF}>
            <span className="sr">{t.genel.telSr} </span>
            {SITE.telefon.gorunen}
          </a>
        </Satir>
        <Satir ikon="wa" ton="wa" etiket={m.whatsapp}>
          <span className={s.telefon}>{SITE.whatsapp.gorunen}</span>
          <Buton href={waHref(t)} yeniSekme yeniSekmeMetni={m.yeniSekme} className={s.waDugme}>
            {m.whatsappEylem}
          </Buton>
        </Satir>
        {SITE.eposta ? (
          <Satir ikon={EnvelopeSimpleIcon} etiket={m.eposta}>
            <a className={s.deger} href={`mailto:${SITE.eposta}`}>
              {SITE.eposta}
            </a>
          </Satir>
        ) : null}
        {SITE.sosyal.map((hesap) => (
          <Satir key={hesap.ad} ikon={InstagramLogoIcon} ton="insta" etiket={hesap.ad}>
            <a className={s.deger} href={hesap.url} target="_blank" rel="noopener noreferrer">
              @{SITE.instagramKullanici}
              <span className="sr">{m.yeniSekme}</span>
            </a>
          </Satir>
        ))}
        <Satir ikon={ClockIcon} etiket={m.saat}>
          <span className={s.deger}>{saatMetni(t)}</span>
        </Satir>
        <Satir ikon={MapPinIcon} etiket={m.adres}>
          <address lang="tr" className={s.adres}>
            {adres1}
            <br />
            {adres2}
          </address>
          <a className={s.tarif} href={YOL_TARIFI} target="_blank" rel="noopener noreferrer">
            <Ikon ikon={NavigationArrowIcon} className={s.tarifIkon} />
            {m.yolTarifi}
            <span className="sr">{m.yeniSekme}</span>
          </a>
        </Satir>
      </dl>
      <KonumHaritasi />
    </div>
  );
}
