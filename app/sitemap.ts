import type { MetadataRoute } from "next";
import { getConfiguredSiteUrl } from "@/lib/site-url";

const routes = [
  "",
  "/quem-somos",
  "/cursos",
  "/noticia",
  "/duvidas",
  "/contato",
  "/en",
  "/en/about",
  "/en/courses",
  "/en/news",
  "/en/faq",
  "/en/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getConfiguredSiteUrl();

  if (!siteUrl) {
    return [];
  }

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
  }));
}
