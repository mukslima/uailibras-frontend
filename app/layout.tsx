import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { getConfiguredSiteUrl } from "@/lib/site-url";
import "@/styles/globals.css";

const siteUrl = getConfiguredSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Uai Libras | Cursos de Libras e Acessibilidade no Brasil",
    template: "%s",
  },
  description:
    "Aprenda Libras do basico ao avancado com a UaiLibras. Cursos online, inclusao e acessibilidade para pessoas surdas.",
  keywords: ["libras", "acessibilidade", "surdos", "cursos de libras", "inclusao"],
  authors: [{ name: "Marcos Lima" }],
  openGraph: {
    title: "Curso de Libras - UaiLibras",
    description: "Aprenda Libras do basico ao avancado com inclusao e acessibilidade.",
    images: siteUrl ? ["/assets/imgs/06.png"] : undefined,
    type: "website",
  },
  verification: {
    google: "BrJZGn6u4zdyEwY3GSgkt94cwhHLJ2OUXXR09sPn2mk",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = (requestHeaders.get("x-uailibras-locale") === "en" ? "en" : "pt-BR") satisfies Locale;
  const dictionary = getDictionary(locale);

  return (
    <html lang={dictionary.htmlLang} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var savedTheme = window.localStorage.getItem("uailibras-theme");
                var theme = savedTheme === "light" || savedTheme === "dark"
                  ? savedTheme
                  : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch (error) {
                document.documentElement.dataset.theme = "light";
                document.documentElement.style.colorScheme = "light";
              }
            })();
          `}
        </Script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <a href="#conteudo" className="skip-link">
          {dictionary.skip}
        </a>
        <Header />
        <div id="conteudo" tabIndex={-1}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
