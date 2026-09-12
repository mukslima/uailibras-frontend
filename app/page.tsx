import Link from "next/link";
import Image from "next/image";
import { HomeCarousel } from "@/components/HomeCarousel";
import { NewsImage } from "@/components/NewsImage";
import { asset, partnerLogos } from "@/data/site";
import { getNewsListState, getNewsUrl, type PublicNews } from "@/lib/news";

const courseCards = [
  {
    title: "Básico 1",
    description:
      "Curso introdutório de Libras para iniciantes, com foco em comunicação básica, sinais do dia a dia e primeiros diálogos.",
  },
  {
    title: "Básico 2",
    description:
      "Continuação do nível básico, desenvolvendo fluência, construção de frases e melhor compreensão da língua de sinais.",
  },
  {
    title: "Uai +",
    description:
      "Curso avançado para aprofundar conhecimentos em Libras, com prática intensiva, expressões mais complexas e maior domínio da comunicação.",
  },
  {
    title: "Transição",
    description:
      "Formação intermediária que prepara o aluno para contextos reais de comunicação, com foco na interpretação e uso profissional da Libras.",
  },
  {
    title: "Transição 2",
    description:
      "Nível avançado de formação para intérpretes, com foco em prática profissional, ética e atuação em diferentes contextos sociais.",
  },
];

export default async function Home() {
  const newsState = await getNewsListState(12);
  const carouselNews = [
    newsState.featured.main,
    ...newsState.featured.secondary,
    ...newsState.featured.normal,
  ].filter((news): news is PublicNews => Boolean(news));
  const carouselSlides = carouselNews.map((news) => ({
    title: news.title,
    description: news.summary,
    href: getNewsUrl(news),
    image: news.coverImage?.url ?? asset("06.png"),
    alt: news.coverImage?.originalName ?? news.title,
  }));
  const homeNews = newsState.news.slice(0, 4);

  return (
    <>
      <main>
        <h1 className="visually-hidden">
          Curso de Libras Online e Presencial com Certificado | UaiLibras Brasil
        </h1>
      </main>

      <HomeCarousel slides={carouselSlides} />

      <section id="cursos" className="cursos">
        <div className="l-curso">
          <h2>Nossos Cursos</h2>
        </div>
        <div className="cards">
          {courseCards.map((course) => (
            <div className="card" key={course.title}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="noticias" className="noticias">
        <h2>Notícias</h2>
        {newsState.status === "error" ? <p className="noticias-status">{newsState.message}</p> : null}
        {homeNews.length === 0 ? (
          <p className="noticias-status">Nenhuma notícia publicada no momento.</p>
        ) : (
          <div className="noticias-grid">
            {homeNews.map((item) => (
              <article className="noticia-card" key={item.slug}>
                <NewsImage news={item} />
                <div className="conteudo">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <Link href={getNewsUrl(item)} className="btn-leia-mais" aria-label={`Leia mais sobre ${item.title}`}>
                    Leia mais
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="cta">
        <div className="container">
          <h2>Pronto para começar sua jornada em Libras?</h2>
          <p>Entre em contato conosco e venha aprender com a UaiLibras!</p>
          <Link href="/contato" className="btn-cta">
            Entrar em contato
          </Link>
        </div>
      </section>

      <section className="parceiros">
        <h2>Territórios conquistados: Marcas e projetos que acessibilizamos pelo Brasil</h2>
        <div className="parceiros-carousel">
          <div className="parceiros-track">
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <Image src={asset(logo)} alt={logo.replace(/\.[^.]+$/, "")} key={`${logo}-${index}`} width={220} height={150} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
