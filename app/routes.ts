import { type RouteConfig, route } from "@react-router/dev/routes";
import { DILLER, SAYFA_ANAHTARLARI, SAYFALAR, rotaId } from "./lib/rotalar.ts";

export default DILLER.flatMap((dil) =>
  SAYFA_ANAHTARLARI.map((anahtar) =>
    route(SAYFALAR[anahtar][dil], SAYFALAR[anahtar].modul, { id: rotaId(dil, anahtar) }),
  ),
) satisfies RouteConfig;
