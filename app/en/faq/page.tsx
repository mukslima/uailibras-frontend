import type { Metadata } from "next";
import { FaqContent } from "@/components/pages/FaqContent";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary("en");

export const metadata: Metadata = {
  title: dictionary.faqPage.metadataTitle,
  description: dictionary.faqPage.metadataDescription,
};

export default function EnglishFaqPage() {
  return <FaqContent locale="en" />;
}
