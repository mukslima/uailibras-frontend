import Image from "next/image";
import { asset } from "@/data/site";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export function CoursesContent({ locale = "pt-BR" }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const courses = dictionary.coursesPage;

  return (
    <main>
      <section className="cursos-header">
        <h1>{courses.title}</h1>
        <p>{courses.intro}</p>
      </section>

      <section className="cursos-lista">
        {courses.items.map((course) => (
          <article className="curso-detalhe" id={course.id} key={course.id}>
            <div className="curso-img">
              <Image src={asset("curso-uai.jpg")} alt={course.alt} width={400} height={300} />
            </div>
            <div className="curso-info">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              {course.benefit ? <p className="curso-beneficio">{course.benefit}</p> : null}
            </div>
          </article>
        ))}
      </section>

      <section className="cursos-contato">
        <h2>{courses.contactTitle}</h2>
        <p>
          {courses.contactText} <strong>contato@uailibras.com.br</strong>
        </p>
      </section>

      <section className="cursos-faq">
        <h2>{courses.faqTitle}</h2>
        {courses.faq.map((item) => (
          <div className="faq-item" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
