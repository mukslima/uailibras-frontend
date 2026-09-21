import type { Metadata } from "next";
import { NewsListContent } from "@/components/pages/NewsListContent";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary("en");

export const metadata: Metadata = {
  title: dictionary.seo.newsTitle,
  description: dictionary.seo.newsDescription,
  alternates: {
    canonical: "/en/news",
    languages: {
      "pt-BR": "/noticia",
      en: "/en/news",
      "x-default": "/noticia",
    },
  },
};

export default async function EnglishNewsPage() {
  return <NewsListContent locale="en" />;
}
