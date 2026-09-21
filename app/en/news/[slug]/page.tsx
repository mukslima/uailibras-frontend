import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticle } from "@/components/NewsArticle";
import { getDictionary } from "@/i18n/dictionaries";
import { fetchPublicNewsBySlug, getNewsImageAlt, getNewsUrl } from "@/lib/news";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const dictionary = getDictionary("en");

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchPublicNewsBySlug(slug, "en").catch(() => null);

  if (!article) {
    return {
      title: dictionary.news.notFound,
    };
  }

  const ptUrl = article.sourceSlug ? `/noticia/${article.sourceSlug}` : undefined;

  return {
    title: `${article.title} | UaiLibras`,
    description: article.summary,
    alternates: {
      canonical: getNewsUrl(article, "en"),
      languages: {
        ...(ptUrl ? { "pt-BR": ptUrl } : {}),
        en: getNewsUrl(article, "en"),
        ...(ptUrl ? { "x-default": ptUrl } : {}),
      },
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      url: getNewsUrl(article, "en"),
      images: article.coverImage?.url
        ? [
            {
              url: article.coverImage.url,
              alt: getNewsImageAlt(article),
            },
          ]
        : undefined,
    },
  };
}

export default async function EnglishNewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await fetchPublicNewsBySlug(slug, "en").catch((error) => {
    if (error instanceof Error) return error;
    return new Error(dictionary.news.error);
  });

  if (!article) {
    notFound();
  }

  if (article instanceof Error) {
    return (
      <main>
        <article className="noticia-detalhe">
          <h1 className="noticia-titulo">{dictionary.news.unavailable}</h1>
          <p>{article.message}</p>
        </article>
      </main>
    );
  }

  return <NewsArticle article={article} locale="en" />;
}
