import assert from "node:assert/strict";
import { test } from "node:test";
import { epostaHatasi } from "../../scripts/yayin-kapi.ts";

test("kurumsal e-posta yoksa veya boşsa kapı hata verir", () => {
  for (const e of [null, "", "   "]) assert.match(epostaHatasi(e) ?? "", /Kurumsal e-posta yok/, JSON.stringify(e));
});

test("geçersiz biçimli e-posta kapıdan geçemez", () => {
  for (const e of ["info", "info@", "info@hanedanpilav", "a b@c.com", "info@@c.com", "[e-posta]"]) {
    assert.match(epostaHatasi(e) ?? "", /geçerli biçimde değil/, e);
  }
});

test("geçerli e-posta kapıdan geçer", () => {
  for (const e of ["info@hanedanpilav.com", "info.hanedanpilav@gmail.com"]) assert.equal(epostaHatasi(e), null, e);
});
