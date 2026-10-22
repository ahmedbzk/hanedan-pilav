import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/global.css";

import jakartaLatin from "@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url";
import rokkittLatinExt from "@fontsource-variable/rokkitt/files/rokkitt-latin-ext-wght-normal.woff2?url";
import rokkittLatin from "@fontsource-variable/rokkitt/files/rokkitt-latin-wght-normal.woff2?url";
import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/root";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { BulunamadiIcerik, HataIcerik } from "./components/HataIcerik.tsx";
import { RotaOdak } from "./components/RotaOdak.tsx";
import { SkipLink } from "./components/SkipLink.tsx";
import { WhatsAppFab } from "./components/WhatsAppFab.tsx";
import { useLang, useT } from "./i18n/index.ts";
import { jsonLdMetni, kokJsonLd } from "./lib/jsonld.ts";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: rokkittLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "preload", href: jakartaLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  // Simgeler public/ altında: favicon.ico (16/32/48), 192 PNG, apple-touch-icon (180), manifest (192/512).
  { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" },
  { rel: "icon", href: "/img/ikon-192.png", type: "image/png", sizes: "192x192" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
];

const JS_ISARETI = "document.documentElement.classList.add('js')";

export function Layout({ children }: { children: ReactNode }) {
  const dil = useLang();
  return (
    <html lang={dil} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#F4C20D" />
        <script dangerouslySetInnerHTML={{ __html: JS_ISARETI }} />
        <Meta />
        <Links />
        {dil === "tr" ? <link rel="preload" href={rokkittLatinExt} as="font" type="font/woff2" crossOrigin="anonymous" /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdMetni(kokJsonLd(dil)) }} />
      </head>
      <body>
        <SkipLink />
        <Header />
        <main id="icerik" tabIndex={-1} data-arka-plan="">
          {children}
        </main>
        <Footer />
        <WhatsAppFab />
        <RotaOdak />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const t = useT();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <>
        <title>{t.sayfalar.bulunamadi.meta.baslik}</title>
        <meta name="robots" content="noindex" />
        <BulunamadiIcerik />
      </>
    );
  }
  const ayrinti = import.meta.env.DEV && error instanceof Error ? error.stack : undefined;
  return (
    <>
      <title>{t.hata.metaBaslik}</title>
      <meta name="robots" content="noindex" />
      <HataIcerik ayrinti={ayrinti} />
    </>
  );
}
