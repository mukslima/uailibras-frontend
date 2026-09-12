import type { PublicNews } from "@/lib/news";
import { getNewsImageAlt } from "@/lib/news";

type NewsImageProps = {
  news: PublicNews;
  className?: string;
};

export function NewsImage({ news, className }: NewsImageProps) {
  if (!news.coverImage?.url) {
    return (
      <div className={`noticia-img-placeholder${className ? ` ${className}` : ""}`} role="img" aria-label="Notícia sem imagem">
        <span>UaiLibras</span>
      </div>
    );
  }

  return <img src={news.coverImage.url} alt={getNewsImageAlt(news)} className={className} />;
}
