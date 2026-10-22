import type { ReactNode } from "react";
import { Link } from "react-router";
import { SITE, adresTekSatir } from "~/content/site.ts";
import { usePaths } from "~/i18n/index.ts";
import type { Blok, Parca, Satir, YasalBolum } from "~/i18n/yasal.ts";
import { TEL_HREF } from "~/lib/iletisim.ts";
import s from "./YasalSayfa.module.css";

function ParcaGoster({ parca }: { parca: Parca }) {
  const { dil, yol } = usePaths();
  if (typeof parca === "string") return <>{parca}</>;
  if ("kalin" in parca) return <strong>{parca.kalin}</strong>;
  if ("sayfa" in parca) return <Link to={yol(parca.sayfa)}>{parca.metin}</Link>;
  switch (parca.sabit) {
    case "telefon":
      return (
        <a className="nw" href={TEL_HREF}>
          {SITE.telefon.gorunen}
        </a>
      );
    case "eposta":
      return SITE.eposta ? <a href={`mailto:${SITE.eposta}`}>{SITE.eposta}</a> : null;
    case "ipSuresi":
      return <>{SITE.yasal.ipSuresi[dil]}</>;
    case "adres":
      return <span lang="tr">{adresTekSatir()}</span>;
  }
}

function SatirGoster({ satir }: { satir: Satir }): ReactNode {
  return satir.map((parca, i) => <ParcaGoster key={i} parca={parca} />);
}

function BlokGoster({ blok }: { blok: Blok }) {
  if ("p" in blok) {
    return (
      <p>
        <SatirGoster satir={blok.p} />
      </p>
    );
  }
  if ("not" in blok) {
    return (
      <p className={s.not}>
        <SatirGoster satir={blok.not} />
      </p>
    );
  }
  if ("liste" in blok) {
    return (
      <ul className={s.liste}>
        {blok.liste.map((satir, i) => (
          <li key={i}>
            <SatirGoster satir={satir} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className={s.kalem}>
      {blok.baslik ? <h3>{blok.baslik}</h3> : null}
      <dl>
        {blok.tanimlar.map((t) => (
          <div key={t.etiket}>
            <dt>{t.etiket}</dt>
            <dd>
              <SatirGoster satir={t.deger} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function YasalBolumGoster({ bolum, no }: { bolum: YasalBolum; no: string }) {
  return (
    <section className={s.bolum} aria-labelledby={bolum.id}>
      <h2 id={bolum.id}>
        <span className={s.no} aria-hidden="true">
          {no}
        </span>
        <span>{bolum.baslik}</span>
      </h2>
      {bolum.bloklar.map((blok, i) => (
        <BlokGoster key={i} blok={blok} />
      ))}
    </section>
  );
}
