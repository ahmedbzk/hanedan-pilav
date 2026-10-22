import { Link } from "react-router";
import { Kap } from "~/components/Bolum.tsx";
import { SayfaBasligi } from "~/components/SayfaBasligi.tsx";
import type { YasalSayfaMetni, YasalSozluk } from "~/i18n/yasal.ts";
import { YasalBolumGoster } from "./YasalMetin.tsx";
import s from "./YasalSayfa.module.css";

type Props<K extends string> = {
  metin: YasalSayfaMetni<K>;
  sira: readonly K[];
  ortak: YasalSozluk["ortak"];
};

const sira2 = (i: number) => String(i + 1).padStart(2, "0");

export function YasalSayfa<K extends string>({ metin, sira, ortak }: Props<K>) {
  const bolumler = sira.map((k) => metin.bolumler[k]);
  return (
    <>
      <SayfaBasligi etiket={metin.etiket} baslik={metin.baslik} giris={metin.giris} />
      <Kap className={s.govde}>
        <div className={s.yerlesim}>
          <nav className={s.icindekiler} aria-labelledby="icindekiler-baslik">
            <h2 id="icindekiler-baslik">{ortak.icindekiler}</h2>
            <ol>
              {bolumler.map((b, i) => (
                <li key={b.id}>
                  <Link to={`#${b.id}`}>
                    <span className={s.no} aria-hidden="true">
                      {sira2(i)}
                    </span>
                    <span>{b.baslik}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className={s.metin}>
            {bolumler.map((b, i) => (
              <YasalBolumGoster key={b.id} bolum={b} no={sira2(i)} />
            ))}
          </div>
        </div>
      </Kap>
    </>
  );
}
