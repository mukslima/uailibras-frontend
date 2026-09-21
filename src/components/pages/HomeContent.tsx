import Image from "next/image";
import Link from "next/link";
import { HomeCarousel } from "@/components/HomeCarousel";
import { NewsImage } from "@/components/NewsImage";
import { asset, partnerLogos } from "@/data/site";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { getNewsListState, getNewsUrl, type PublicNews } from "@/lib/news";

export async function HomeContent({ locale = "pt-BR" }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const newsState = await getNewsListState(12, locale);
  const carouselNews = [
    newsState.featured.main,
    ...newsState.featured.secondary,
    ...newsState.featured.normal,
  ].filter((news): news is PublicNews => Boolean(news));
  const carouselSlides = carouselNews.map((news) => ({
    title: news.title,
    description: news.summary,
    href: getNewsUrl(news, locale),
    image: news.coverImage?.url ?? asset("06.png"),
    alt: news.coverImage?.originalName ?? news.title,
  }));
  const homeNews = newsState.news.slice(0, 4);

  return (
    <>
      <main>
        <h1 className="visually-hidden">{dictionary.seo.homeTitle}</h1>
      </main>
      <HomeCarousel labels={dictionary.home.carousel} slides={carouselSlides} />
      <section id="cursos" className="cursos">
        <div className="l-curso">
          <h2>{dictionary.home.coursesTitle}</h2>
        </div>
        <div className="cards">
          {dictionary.home.courseCards.map((course) => (
            <div className="card" key={course.title}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="noticias" className="noticias">
        <h2>{dictionary.news.title}</h2>
        {newsState.status === "error" ? <p className="noticias-status">{newsState.message}</p> : null}
        {homeNews.length === 0 ? (
          <p className="noticias-status">{dictionary.news.empty}</p>
        ) : (
          <div className="noticias-grid">
            {homeNews.map((item) => (
              <article className="noticia-card" key={item.slug}>
                <NewsImage news={item} />
                <div className="conteudo">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <Link href={getNewsUrl(item, locale)} className="btn-leia-mais" aria-label={`${dictionary.news.readMoreAbout} ${item.title}`}>
                    {dictionary.news.readMore}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="cta">
        <div className="container">
          <h2>{dictionary.home.ctaTitle}</h2>
          <p>{dictionary.home.ctaText}</p>
          <Link href={dictionary.home.ctaHref} className="btn-cta">
            {dictionary.home.ctaButton}
          </Link>
        </div>
      </section>
      <section className="parceiros">
        <h2>{dictionary.home.partnersTitle}</h2>
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
