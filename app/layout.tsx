import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    "Aprenda Libras do básico ao avançado com a UaiLibras. Cursos online, inclusão e acessibilidade para pessoas surdas.",
  keywords: ["libras", "acessibilidade", "surdos", "cursos de libras", "inclusão"],
  authors: [{ name: "Marcos Lima" }],
  openGraph: {
    title: "Curso de Libras - UaiLibras",
    description: "Aprenda Libras do básico ao avançado com inclusão e acessibilidade.",
    images: siteUrl ? ["/assets/imgs/06.png"] : undefined,
    type: "website",
  },
  verification: {
    google: "BrJZGn6u4zdyEwY3GSgkt94cwhHLJ2OUXXR09sPn2mk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
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
          Ir para o conteúdo
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
