import Image from "next/image";
import { asset } from "@/data/site";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export function AboutContent({ locale = "pt-BR" }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const about = dictionary.about;

  return (
    <main>
      <section className="quem-somos">
        <h1>{about.title}</h1>
        <div className="grupo">
          <Image src={asset("curso-uai.jpg")} alt={about.imageAlt} width={400} height={300} />
          <div className="texto">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        {about.foundersParagraphs.length > 0 ? (
          <>
            <h2>{about.foundersTitle}</h2>
            <div className="pessoa">
              <Image src={asset("expofavela-uai.png")} alt={about.foundersImageAlt} width={400} height={300} />
              <div className="texto">
                {about.foundersParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
