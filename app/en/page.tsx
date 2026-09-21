import type { Metadata } from "next";
import { HomeContent } from "@/components/pages/HomeContent";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary("en");

export const metadata: Metadata = {
  title: dictionary.seo.homeTitle,
  description: dictionary.seo.homeDescription,
  alternates: {
    canonical: "/en",
    languages: {
      "pt-BR": "/",
      en: "/en",
      "x-default": "/",
    },
  },
};

export default async function EnglishHome() {
  return <HomeContent locale="en" />;
}
