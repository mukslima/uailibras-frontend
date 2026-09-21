import type { Metadata } from "next";
import { ContactContent } from "@/components/pages/ContactContent";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary("en");

export const metadata: Metadata = {
  title: dictionary.contactPage.metadataTitle,
  description: dictionary.contactPage.metadataDescription,
};

export default function EnglishContactPage() {
  return <ContactContent locale="en" />;
}
