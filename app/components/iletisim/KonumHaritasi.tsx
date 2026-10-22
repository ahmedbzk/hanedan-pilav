import { MapPinIcon } from "@phosphor-icons/react/MapPin";
import { MapTrifoldIcon } from "@phosphor-icons/react/MapTrifold";
import { useState } from "react";
import { Ikon } from "~/components/Ikon.tsx";
import { SITE } from "~/content/site.ts";
import { useIletisim } from "~/i18n/iletisim.ts";
import { GOOGLE_HARITA } from "~/lib/iletisim.ts";
import s from "./KonumHaritasi.module.css";

// Google çerezleri ziyaretçinin onayı olmadan yazılmasın diye harita yalnız tıklanınca yüklenir.
export function KonumHaritasi() {
  const m = useIletisim().bilgi.harita;
  const [acik, setAcik] = useState(false);
  return (
    <section className={s.kutu} aria-labelledby="konum-baslik" data-acik={acik ? "true" : "false"}>
      <h2 id="konum-baslik" className={s.baslik}>
        <Ikon ikon={MapPinIcon} className={s.baslikIkon} />
        {m.baslik}
      </h2>
      <div className={s.cerceve}>
        {acik ? (
          <iframe
            title={m.cerceve}
            src={GOOGLE_HARITA}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className={s.onizleme}>
            <p className={s.ilce} lang="tr" translate="no">
              {SITE.adres.ilce}, {SITE.adres.il}
            </p>
            <button type="button" className={s.dugme} onClick={() => setAcik(true)}>
              <Ikon ikon={MapTrifoldIcon} className={s.dugmeIkon} />
              {m.goster}
            </button>
            <p className={s.not}>{m.not}</p>
          </div>
        )}
      </div>
    </section>
  );
}
