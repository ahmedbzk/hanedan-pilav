import { epostaGecerli } from "../app/components/form/dogrula.ts";

export function ipGorevHatasi(kuruldu: boolean): string | null {
  return kuruldu ? null : "Plesk zamanlanmış IP özeti temizlik görevi kurulmadı; README yayın bölümüne bakın.";
}

export function epostaHatasi(eposta: string | null): string | null {
  if (!eposta?.trim()) return "Kurumsal e-posta yok (site.ts eposta).";
  return epostaGecerli(eposta) ? null : `Kurumsal e-posta (${eposta}) geçerli biçimde değil (site.ts eposta).`;
}
