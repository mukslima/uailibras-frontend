import { cache } from "react";
import type { Locale } from "../i18n/dictionaries";

export const NEWS_FETCH_CACHE: RequestCache = "no-store";

export type PublicUser = {
  id?: string;
  name?: string;
  username?: string;
};

export type PublicTaxonomy = {
  id?: string;
  name: string;
  slug: string;
};

export type PublicMedia = {
  id?: string;
  url: string;
  originalName?: string;
  width?: number | null;
  height?: number | null;
};

export type PublicNews = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author?: PublicUser | null;
  primaryCategory?: PublicTaxonomy | null;
  coverImage?: PublicMedia | null;
  categories: PublicTaxonomy[];
  tags: PublicTaxonomy[];
  featuredPosition: 1 | 2 | 3 | null;
  publishedAt?: string | null;
  sourceSlug?: string | null;
};

type NewsApiRelation<T> = {
  category?: T;
  tag?: T;
};

type PublicNewsApiItem = Omit<PublicNews, "categories" | "tags" | "featuredPosition"> & {
  categories?: NewsApiRelation<PublicTaxonomy>[];
  tags?: NewsApiRelation<PublicTaxonomy>[];
  featuredPosition?: number | null;
};

type PublicNewsListResponse = {
  items?: PublicNewsApiItem[];
};

type PublicTranslationLinkResponse = {
  locale: "en";
  slug: string;
};

type NextFetchRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export type FeaturedNewsSlots = {
  main: PublicNews | null;
  secondary: PublicNews[];
  normal: PublicNews[];
};

export type NewsListState =
  | { status: "ok"; news: PublicNews[]; featured: FeaturedNewsSlots }
  | { status: "error"; news: PublicNews[]; featured: FeaturedNewsSlots; message: string };

export class NewsApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "NewsApiError";
  }
}

function getApiBaseUrl() {
  return (process.env.UAILIBRAS_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333").replace(/\/$/, "");
}

function isFeaturedPosition(value: number | null | undefined): value is 1 | 2 | 3 {
  return value === 1 || value === 2 || value === 3;
}

function mapNewsItem(item: PublicNewsApiItem): PublicNews {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    content: item.content,
    author: item.author ?? null,
    primaryCategory: item.primaryCategory ?? null,
    coverImage: item.coverImage ?? null,
    categories: (item.categories ?? []).map((relation) => relation.category).filter(Boolean) as PublicTaxonomy[],
    tags: (item.tags ?? []).map((relation) => relation.tag).filter(Boolean) as PublicTaxonomy[],
    featuredPosition: isFeaturedPosition(item.featuredPosition) ? item.featuredPosition : null,
    publishedAt: item.publishedAt ?? null,
    sourceSlug: item.sourceSlug ?? null,
  };
}

export function partitionFeaturedNews(news: PublicNews[]): FeaturedNewsSlots {
  const main = news.find((item) => item.featuredPosition === 1) ?? null;
  const secondary = [2, 3]
    .map((position) => news.find((item) => item.featuredPosition === position))
    .filter(Boolean) as PublicNews[];
  const featuredSlugs = new Set([main?.slug, ...secondary.map((item) => item.slug)].filter(Boolean));
  const normal = news.filter((item) => !featuredSlugs.has(item.slug));

  return {
    main,
    secondary,
    normal,
  };
}

export async function fetchPublicNews(pageSize = 20): Promise<PublicNews[]> {
  return fetchPublicNewsForLocale("pt-BR", pageSize);
}

export async function fetchPublicNewsForLocale(locale: Locale, pageSize = 20): Promise<PublicNews[]> {
  const params = new URLSearchParams({
    page: "1",
    pageSize: String(pageSize),
  });
  const fetchOptions: NextFetchRequestInit = {
    cache: NEWS_FETCH_CACHE,
  };
  const path = locale === "en" ? "/api/v1/news/i18n/en" : "/api/v1/news";
  const response = await fetch(`${getApiBaseUrl()}${path}?${params.toString()}`, fetchOptions);

  if (!response.ok) {
    throw new NewsApiError(locale === "en" ? "Could not load the news." : "Nao foi possivel carregar as noticias.", response.status);
  }

  const data = (await response.json()) as PublicNewsListResponse;
  return (data.items ?? []).map(mapNewsItem);
}

export const fetchPublicNewsBySlug = cache(async function fetchPublicNewsBySlug(
  slug: string,
  locale: Locale = "pt-BR",
): Promise<PublicNews | null> {
  const fetchOptions: NextFetchRequestInit = {
    cache: NEWS_FETCH_CACHE,
  };
  const path = locale === "en" ? `/api/v1/news/i18n/en/${encodeURIComponent(slug)}` : `/api/v1/news/${encodeURIComponent(slug)}`;
  const response = await fetch(`${getApiBaseUrl()}${path}`, fetchOptions);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new NewsApiError(locale === "en" ? "Could not load the news article." : "Nao foi possivel carregar a noticia.", response.status);
  }

  return mapNewsItem((await response.json()) as PublicNewsApiItem);
});

export const fetchPublicTranslationLink = cache(async function fetchPublicTranslationLink(
  slug: string,
  locale: "en",
): Promise<PublicTranslationLinkResponse | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/news/${encodeURIComponent(slug)}/i18n/${locale}/link`, {
    cache: NEWS_FETCH_CACHE,
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new NewsApiError("Nao foi possivel carregar a traducao da noticia.", response.status);
  }

  return (await response.json()) as PublicTranslationLinkResponse;
});

export async function getNewsListState(pageSize = 20, locale: Locale = "pt-BR"): Promise<NewsListState> {
  try {
    const news = await fetchPublicNewsForLocale(locale, pageSize);
    return {
      status: "ok",
      news,
      featured: partitionFeaturedNews(news),
    };
  } catch (error) {
    return {
      status: "error",
      news: [],
      featured: partitionFeaturedNews([]),
      message: error instanceof Error ? error.message : locale === "en" ? "Could not load the news." : "Nao foi possivel carregar as noticias.",
    };
  }
}

export function formatPublishedDate(value?: string | null, locale: Locale = "pt-BR") {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function isSafeUrl(value: string, allowRelative = false) {
  if (allowRelative && value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

const allowedRichTextClasses = new Set([
  "text-align-left",
  "text-align-center",
  "text-align-right",
  "text-align-justify",
  "image-size-small",
  "image-size-medium",
  "image-size-large",
  "image-size-full",
  "image-align-left",
  "image-align-center",
  "image-align-right",
]);

function sanitizeClassList(value: string) {
  return value
    .split(/\s+/)
    .filter((className) => allowedRichTextClasses.has(className))
    .join(" ");
}

export function sanitizePublicRichText(content: string) {
  const allowedTags = new Set(["p", "br", "strong", "em", "u", "s", "blockquote", "ul", "ol", "li", "a", "h2", "h3", "h4", "img"]);
  const withoutDangerousBlocks = content.replace(/<\s*(script|style|iframe|object|embed|svg|math)[\s\S]*?<\s*\/\s*\1\s*>/gi, "");

  return withoutDangerousBlocks.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (tag, tagName: string, rawAttrs: string) => {
    const normalizedTag = tagName.toLowerCase();
    const isClosing = tag.startsWith("</");

    if (!allowedTags.has(normalizedTag)) return "";
    if (isClosing) return `</${normalizedTag}>`;
    if (normalizedTag === "br") return "<br>";

    const attrs: string[] = [];
    const attrPattern = /([a-zA-Z:-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>`]+)))?/g;
    let match: RegExpExecArray | null;

    while ((match = attrPattern.exec(rawAttrs)) !== null) {
      const name = match[1].toLowerCase();
      const value = match[3] ?? match[4] ?? match[5] ?? "";

      if (normalizedTag === "a" && ["href", "title", "target"].includes(name)) {
        if (name === "href" && !isSafeUrl(value, true)) continue;
        attrs.push(`${name}="${escapeAttribute(value)}"`);
      }

      if (normalizedTag === "img" && ["src", "alt", "title"].includes(name)) {
        if (name === "src" && !isSafeUrl(value)) continue;
        attrs.push(`${name}="${escapeAttribute(value)}"`);
      }

      if (["p", "h2", "h3", "h4", "blockquote", "img"].includes(normalizedTag) && name === "class") {
        const safeClass = sanitizeClassList(value);
        if (safeClass) attrs.push(`class="${escapeAttribute(safeClass)}"`);
      }
    }

    if (normalizedTag === "a") {
      attrs.push('rel="noopener noreferrer"');
    }

    return `<${normalizedTag}${attrs.length ? ` ${attrs.join(" ")}` : ""}>`;
  });
}

export function getNewsUrl(news: Pick<PublicNews, "slug">, locale: Locale = "pt-BR") {
  return locale === "en" ? `/en/news/${news.slug}` : `/noticia/${news.slug}`;
}

export function getNewsImageAlt(news: Pick<PublicNews, "title" | "coverImage">) {
  return news.coverImage?.originalName || news.title;
}
