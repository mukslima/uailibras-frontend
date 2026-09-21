import type { Metadata } from "next";
import { CoursesContent } from "@/components/pages/CoursesContent";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary("en");

export const metadata: Metadata = {
  title: dictionary.coursesPage.metadataTitle,
  description: dictionary.coursesPage.metadataDescription,
};

export default function EnglishCoursesPage() {
  return <CoursesContent locale="en" />;
}
