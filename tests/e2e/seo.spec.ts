import { expect, test } from "@playwright/test";
import { satirIciBetikHashleri } from "../../scripts/yayin-lib.ts";
import { KARSILIK, SITE, TUM_YOLLAR, dilBul } from "./yardimci.ts";

const OG_LOCALE = { tr: "tr_TR", en: "en_US" } as const;
const KARSI_DIL = { tr: "en", en: "tr" } as const;
const NOINDEX_YOLLARI = ["/404", "/en/404"];
const ANASAYFALAR = ["/", "/en"];
const MERKEZLI_YOLLAR = ["/", "/en", "/iletisim", "/en/contact"];
type Ld = { "@type"?: string; "@graph"?: Ld[]; itemListElement?: { position: number; name: string; item: string }[] };

async function jsonLdler(page: import("@playwright/test").Page): Promise<Ld[]> {
  const bloklar = await page.locator('script[type="application/ld+json"]').allTextContents();
  return bloklar.flatMap((b) => {
    const veri = JSON.parse(b) as Ld;
    return veri["@graph"] ?? [veri];
  });
}
const STAGING = process.env.SITE_ORTAM === "staging";

async function meta(page: import("@playwright/test").Page, secici: string): Promise<string | null> {
  return page.locator(secici).first().getAttribute("content");
}

test.describe("seo meta", () => {
  for (const yol of TUM_YOLLAR) {
    test(`${yol}: title, description, canonical, hreflang, og, twitter`, async ({ page }) => {
      await page.goto(yol);
      const dil = dilBul(yol);
      const baslik = await page.title();
      expect(baslik.length).toBeGreaterThan(0);
      expect(baslik.length, "title <= 60").toBeLessThanOrEqual(60);

      const aciklama = (await meta(page, 'meta[name="description"]')) ?? "";
      expect(aciklama.length).toBeGreaterThan(0);
      expect(aciklama.length, "description <= 160").toBeLessThanOrEqual(160);
      expect(aciklama.endsWith("…"), "description sözlükte kısaltılmış olmalı, seo.ts kesmesine düşmemeli").toBe(false);
      expect(baslik.endsWith("…"), "title seo.ts kesmesine düşmemeli").toBe(false);

      const url = `${SITE.alanAdi}${yol}`;
      if (NOINDEX_YOLLARI.includes(yol)) {
        // noindex sayfası kanonik/hreflang kümesine girmez.
        await expect(page.locator('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:url"]')).toHaveCount(0);
      } else {
        await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", url);
        expect(url.endsWith("/") && yol !== "/").toBe(false);

        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
        const trUrl = await page.locator('link[rel="alternate"][hreflang="tr"]').getAttribute("href");
        const enUrl = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute("href");
        const varsayilan = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute("href");
        expect(dil === "tr" ? trUrl : enUrl).toBe(url);
        expect(dil === "tr" ? enUrl : trUrl).toBe(`${SITE.alanAdi}${KARSILIK.get(yol)}`);
        expect(trUrl).toMatch(/^https:\/\/www\.hanedanpilav\.com\//);
        expect(enUrl).toMatch(/^https:\/\/www\.hanedanpilav\.com\/en(\/|$)/);
        expect(varsayilan).toBe(trUrl);
        expect(await meta(page, 'meta[property="og:url"]')).toBe(url);
      }
      for (const ad of ["description", "twitter:card", "twitter:title"]) await expect(page.locator(`meta[name="${ad}"]`), ad).toHaveCount(1);
      for (const ad of ["og:title", "og:description", "og:image"]) await expect(page.locator(`meta[property="${ad}"]`), ad).toHaveCount(1);

      expect(await meta(page, 'meta[property="og:title"]')).toBe(baslik);
      expect(await meta(page, 'meta[property="og:description"]')).toBe(aciklama);
      const ogGorsel = await meta(page, 'meta[property="og:image"]');
      expect(ogGorsel).toMatch(/^https:\/\/www\.hanedanpilav\.com\/img\/.+\.png$/);
      expect(await meta(page, 'meta[property="og:image:width"]')).toBe("1200");
      expect(await meta(page, 'meta[property="og:image:height"]')).toBe("630");
      expect((await meta(page, 'meta[property="og:image:alt"]'))?.length).toBeGreaterThan(10);
      expect(await meta(page, 'meta[name="twitter:image:alt"]')).toBe(await meta(page, 'meta[property="og:image:alt"]'));
      expect(await meta(page, 'meta[property="og:locale"]')).toBe(OG_LOCALE[dil]);
      expect(await meta(page, 'meta[property="og:locale:alternate"]')).toBe(OG_LOCALE[KARSI_DIL[dil]]);
      expect(await meta(page, 'meta[name="twitter:card"]')).toBe("summary_large_image");
      expect(await meta(page, 'meta[name="twitter:title"]')).toBe(baslik);
      expect(await meta(page, 'meta[name="twitter:image"]')).toBe(ogGorsel);
      const gorsel = await page.request.get(new URL(ogGorsel ?? "", SITE.alanAdi).pathname);
      expect(gorsel.status()).toBe(200);
      expect(gorsel.headers()["content-type"]).toBe("image/png");
    });

    test(`${yol}: JSON-LD ayrıştırılır; Organization, işletme ve kırıntılar`, async ({ page }) => {
      await page.goto(yol);
      const dil = dilBul(yol);
      const veriler = await jsonLdler(page);
      const tipler = veriler.map((v) => v["@type"]);
      expect(tipler).toContain("Organization");
      expect(tipler).toContain("WebSite");
      const isletmeli = MERKEZLI_YOLLAR.includes(yol) || /\/(bayilerimiz|locations)\/[^/]+$/.test(yol);
      expect(tipler.includes("FoodEstablishment"), "merkez işletme").toBe(isletmeli);

      const kirinti = veriler.find((v) => v["@type"] === "BreadcrumbList");
      if (ANASAYFALAR.includes(yol) || NOINDEX_YOLLARI.includes(yol)) {
        expect(kirinti).toBeUndefined();
      } else {
        const ogeler = kirinti?.itemListElement ?? [];
        expect(ogeler.length).toBeGreaterThanOrEqual(2);
        expect(ogeler.map((o) => o.position)).toEqual(ogeler.map((_, i) => i + 1));
        expect(ogeler[0]?.item).toBe(`${SITE.alanAdi}${dil === "tr" ? "/" : "/en"}`);
        expect(ogeler.at(-1)?.item).toBe(`${SITE.alanAdi}${yol}`);
        expect(ogeler.every((o) => o.name.length > 0)).toBe(true);
      }
    });
  }

  for (const yol of NOINDEX_YOLLARI) {
    test(`${yol}: noindex`, async ({ page }) => {
      await page.goto(yol);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    });
  }

  test("indekslenen sayfalarda robots noindex yok", async ({ page }) => {
    for (const yol of TUM_YOLLAR.filter((y) => !NOINDEX_YOLLARI.includes(y))) {
      await page.goto(yol);
      await expect(page.locator('meta[name="robots"][content*="noindex"]'), yol).toHaveCount(0);
    }
  });
});

test.describe("simgeler ve manifest", () => {
  test("favicon.ico, apple-touch-icon, 192/512 simgeler ve manifest sunulur, head'de bağlıdır", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/site.webmanifest");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#F4C20D");
    for (const [yol, tur] of [
      ["/favicon.ico", "image/x-icon"],
      ["/apple-touch-icon.png", "image/png"],
      ["/img/ikon-192.png", "image/png"],
      ["/img/ikon-512.png", "image/png"],
      ["/img/ikon-maskable-512.png", "image/png"],
    ] as const) {
      const y = await request.get(yol);
      expect(y.status(), yol).toBe(200);
      expect(y.headers()["content-type"], yol).toBe(tur);
    }
    const manifest = (await (await request.get("/site.webmanifest")).json()) as {
      name: string;
      theme_color: string;
      icons: { src: string; sizes: string }[];
    };
    expect(manifest.name).toBe(SITE.marka);
    expect(manifest.theme_color).toBe("#F4C20D");
    expect(manifest.icons.map((i) => i.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    for (const i of manifest.icons) expect((await request.get(i.src)).status(), i.src).toBe(200);
  });
});

test.describe("sitemap, robots, .htaccess", () => {
  test("sitemap tüm sayfaları içerir, 404 hariç, alternatiflerle", async ({ request }) => {
    const yanit = await request.get("/sitemap.xml");
    expect(yanit.status()).toBe(200);
    const xml = await yanit.text();
    const locler = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const beklenen = TUM_YOLLAR.filter((y) => !NOINDEX_YOLLARI.includes(y)).map((y) => `${SITE.alanAdi}${y}`);
    expect([...locler].sort()).toEqual([...beklenen].sort());
    expect(locler.some((l) => l?.endsWith("/404"))).toBe(false);
    expect(xml).toMatch(/hreflang="x-default"/);
    expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    const gorseller = [...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1] ?? "");
    expect(gorseller.length).toBeGreaterThan(0);
    for (const g of new Set(gorseller)) expect((await request.get(new URL(g).pathname)).status(), g).toBe(200);
  });

  test("robots.txt ortama uygun", async ({ request }) => {
    const metin = await (await request.get("/robots.txt")).text();
    if (STAGING) {
      expect(metin).toMatch(/^Disallow: \/$/m);
    } else {
      expect(metin).not.toMatch(/^Disallow: \/\s*$/m);
      expect(metin).toContain(`Sitemap: ${SITE.alanAdi}/sitemap.xml`);
    }
  });

  test(".htaccess CSP: her sayfanın satır içi betik hash'i izinli, unsafe-inline betikte yok", async ({ request }) => {
    const htaccess = await (await request.get("/.htaccess")).text();
    const csp = /Content-Security-Policy "([^"]+)"/.exec(htaccess)?.[1] ?? "";
    expect(csp).toContain("script-src 'self' 'sha256-");
    const betikYonergesi = csp.split("; ").find((p) => p.startsWith("script-src ")) ?? "";
    expect(betikYonergesi).not.toContain("unsafe-inline");
    expect(htaccess.includes("X-Robots-Tag")).toBe(STAGING ? true : false);
    for (const yol of TUM_YOLLAR) {
      const html = await (await request.get(yol)).text();
      for (const h of satirIciBetikHashleri(html)) {
        expect(betikYonergesi, `${yol} için hash eksik`).toContain(h);
      }
    }
  });
});
