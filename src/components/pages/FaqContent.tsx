import { FaqAccordion } from "@/components/FaqAccordion";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export function FaqContent({ locale = "pt-BR" }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);

  return (
    <main>
      <section className="faq-section">
        <h1>{dictionary.faqPage.title}</h1>
        <FaqAccordion items={dictionary.faqPage.items} />
      </section>
    </main>
  );
}
