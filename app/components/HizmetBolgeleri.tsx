import { useLang } from "~/i18n/index.ts";
import { HARITA_METNI } from "~/i18n/harita.ts";
import { SITE } from "~/content/site.ts";
import s from "./HizmetBolgeleri.module.css";

export function HizmetBolgeleri({ baslikId, seviye = "h3" }: { baslikId: string; seviye?: "h2" | "h3" }) {
  const m = HARITA_METNI[useLang()].bolgeler;
  const Baslik = seviye;
  return (
    <div className={s.bolgeler}>
      <Baslik id={baslikId}>{m.baslik}</Baslik>
      <p className={s.merkezNot} lang="tr" translate="no">
        <strong>{SITE.adres.ilce}</strong> <span>({m.merkez})</span>
      </p>
      <ul className={s.etiketler} aria-label={m.liste} lang="tr" translate="no">
        {SITE.hizmetBolgeleri.map((b) => (
          <li key={b.ad}>{b.ad}</li>
        ))}
      </ul>
    </div>
  );
}
