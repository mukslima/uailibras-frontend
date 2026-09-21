import { NewsImage } from "@/components/NewsImage";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import type { PublicNews } from "@/lib/news";
import { formatPublishedDate, sanitizePublicRichText } from "@/lib/news";

type NewsArticleProps = {
  article: PublicNews;
  locale?: Locale;
};

export function NewsArticle({ article, locale = "pt-BR" }: NewsArticleProps) {
  const dictionary = getDictionary(locale);
  const publishedDate = formatPublishedDate(article.publishedAt, locale);
  const categoryNames = article.categories.map((category) => category.name);
  const tagNames = article.tags.map((tag) => tag.name);

  return (
    <main>
      <article className="noticia-detalhe">
        <h1 className="noticia-titulo">{article.title}</h1>
        <div className="noticia-meta">
          {article.author?.name ? (
            <span className="noticia-autor">
              {dictionary.news.by} <strong>{article.author.name}</strong>
            </span>
          ) : null}
          {publishedDate ? <span className="noticia-data">{dictionary.news.published} {publishedDate}</span> : null}
        </div>
        <NewsImage news={article} className="noticia-img" />
        <p className="noticia-subtitulo">{article.summary}</p>
        {categoryNames.length > 0 ? (
          <div className="noticia-taxonomia" aria-label={dictionary.news.categories}>
            {categoryNames.map((category) => (
              <span className="categoria" key={category}>
                {category}
              </span>
            ))}
          </div>
        ) : null}
        <div
          className="noticia-conteudo"
          dangerouslySetInnerHTML={{ __html: sanitizePublicRichText(article.content) }}
        />
        {tagNames.length > 0 ? (
          <div className="noticia-tags" aria-label={dictionary.news.tags}>
            {tagNames.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        ) : null}
      </article>
    </main>
  );
}
