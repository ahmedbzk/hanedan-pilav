import assert from "node:assert/strict";
import { test } from "node:test";
import { GALERI } from "../../app/content/galeri.ts";
import { tumYollar } from "../../app/lib/rotalar.ts";
import { bilinmeyenBayiKabugu, robotsUret, sitemapKayitlari, sitemapUret } from "../../scripts/yayin-lib.ts";

const TABAN = "https://www.hanedanpilav.com";

test("sitemap 404 hariç tüm prerender yollarını içerir", () => {
  const kayitlar = sitemapKayitlari(TABAN);
  const beklenen = tumYollar().filter((y) => !y.endsWith("/404"));
  assert.deepEqual(kayitlar.map((k) => k.loc).sort(), beklenen.map((y) => `${TABAN}${y}`).sort());
  assert.ok(!kayitlar.some((k) => k.loc.endsWith("/404")));
});

test("her kayıt tr, en ve x-default alternatiflerini taşır; x-default TR adresidir", () => {
  for (const k of sitemapKayitlari(TABAN)) {
    assert.deepEqual(k.alternatifler.map((a) => a.hreflang), ["tr", "en", "x-default"]);
    assert.equal(k.alternatifler[2]?.href, k.alternatifler[0]?.href);
    assert.ok(k.alternatifler.some((a) => a.href === k.loc));
  }
});

test("sitemapUret geçerli xml, lastmod ve xhtml:link üretir, kaçışlar", () => {
  const xml = sitemapUret(
    [{ loc: "https://x.test/a?b=1&c=2", alternatifler: [{ hreflang: "tr", href: "https://x.test/a?b=1&c=2" }] }],
    "2026-01-02",
  );
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<lastmod>2026-01-02<\/lastmod>/);
  assert.match(xml, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.match(xml, /<loc>https:\/\/x\.test\/a\?b=1&amp;c=2<\/loc>/);
  assert.match(xml, /<xhtml:link rel="alternate" hreflang="tr" /);
});

test("robots: staging her şeyi kapatır, production izin verir ve sitemap bildirir", () => {
  assert.equal(robotsUret("staging"), "User-agent: *\nDisallow: /\n");
  const canli = robotsUret("production", TABAN);
  assert.match(canli, /^Allow: \//m);
  assert.doesNotMatch(canli, /^Disallow: \/\s*$/m);
  assert.match(canli, new RegExp(`^Sitemap: ${TABAN}/sitemap\\.xml$`, "m"));
});

test("görsel uzantısı: galeri sayfaları (TR, EN) tüm fotoğrafları taşır, diğerleri taşımaz", () => {
  const fotolar = GALERI.flatMap((o) => (o.src ? [`${TABAN}${o.src}`] : []));
  for (const k of sitemapKayitlari(TABAN)) {
    const galeri = k.loc === `${TABAN}/galeri` || k.loc === `${TABAN}/en/gallery`;
    assert.deepEqual(k.gorseller ?? [], galeri ? fotolar : [], k.loc);
  }
  const xml = sitemapUret(sitemapKayitlari(TABAN), "2026-01-02");
  assert.match(xml, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.equal(xml.match(/<image:loc>/g)?.length, fotolar.length * 2);
});

test("hreflang karşılıklıdır: her alternatif de aynı kümeyi bildirir", () => {
  const kayitlar = sitemapKayitlari(TABAN);
  const kume = new Map(kayitlar.map((k) => [k.loc, JSON.stringify(k.alternatifler)]));
  for (const k of kayitlar) {
    for (const a of k.alternatifler) assert.equal(kume.get(a.href), JSON.stringify(k.alternatifler), `${k.loc} -> ${a.href}`);
  }
});

test("EN bilinmeyen bayi kabuğu: detayın SEO aralığı, JSON-LD'si ve main'i 404'ünkiyle değişir", () => {
  const detay =
    '<head><title>Detay</title><link rel="canonical" href="x"/><meta name="twitter:image:alt" content="a"/>' +
    '<script type="application/ld+json">{"@type":"FoodEstablishment"}</script>' +
    '<script type="application/ld+json">{"@type":"BreadcrumbList"}</script><link rel="stylesheet"/><script>js()</script>' +
    '<script type="application/ld+json">{"@graph":[1]}</script></head><body><main>detay</main></body>';
  const bulunamadi =
    '<head><title>404</title><meta name="robots" content="noindex"/><meta name="twitter:image:alt" content="b"/>' +
    '<script type="application/ld+json">{"@graph":[1]}</script></head><body><main>bulunamadı</main></body>';
  const kabuk = bilinmeyenBayiKabugu(detay, bulunamadi);
  assert.match(kabuk, /<title>404<\/title><meta name="robots" content="noindex"\/>/);
  assert.doesNotMatch(kabuk, /canonical|FoodEstablishment|BreadcrumbList|detay/);
  assert.equal(kabuk.match(/application\/ld\+json/g)?.length, 1);
  // Ortak kök grafiği yerinde kalır (stil ve betikten sonra), hidrasyon sırası korunur.
  assert.match(kabuk, /<link rel="stylesheet"\/><script>js\(\)<\/script><script type="application\/ld\+json">\{"@graph":\[1\]\}<\/script><\/head>/);
  assert.match(kabuk, /<main>bulunamadı<\/main>/);
  assert.throws(() => bilinmeyenBayiKabugu(detay, bulunamadi.replace('<meta name="robots" content="noindex"/>', "")));
  assert.throws(() => bilinmeyenBayiKabugu(detay, bulunamadi.replace("[1]", "[2]")));
});
