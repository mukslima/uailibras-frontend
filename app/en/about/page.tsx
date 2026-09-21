import type { Metadata } from "next";
import { AboutContent } from "@/components/pages/AboutContent";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary("en");

export const metadata: Metadata = {
  title: dictionary.about.metadataTitle,
  description: dictionary.about.metadataDescription,
};

export default function EnglishAboutPage() {
  return <AboutContent locale="en" />;
}
