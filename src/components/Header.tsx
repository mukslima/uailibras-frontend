"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { asset } from "@/data/site";
import { getDictionary, getLocaleFromPath, type Locale } from "@/i18n/dictionaries";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = getLocaleFromPath(pathname);
  const dictionary = getDictionary(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuListRef = useRef<HTMLUListElement | null>(null);
  const languageButtonRef = useRef<HTMLButtonElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const firstLink = menuListRef.current?.querySelector<HTMLAnchorElement>("a");
    window.setTimeout(() => firstLink?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isLanguageOpen) return;

    const firstOption = languageMenuRef.current?.querySelector<HTMLButtonElement>("button");
    window.setTimeout(() => firstOption?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsLanguageOpen(false);
        languageButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLanguageOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  function getApiBaseUrl() {
    return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333").replace(/\/$/, "");
  }

  async function getTranslatedArticlePath(targetLocale: Locale) {
    if (targetLocale === "en" && pathname.startsWith("/noticia/")) {
      const slug = pathname.replace(/^\/noticia\//, "");
      const response = await fetch(`${getApiBaseUrl()}/api/v1/news/${encodeURIComponent(slug)}/i18n/en/link`).catch(() => null);
      if (!response?.ok) return "/en/news";
      const data = (await response.json().catch(() => null)) as { slug?: string } | null;
      return data?.slug ? `/en/news/${data.slug}` : "/en/news";
    }

    if (targetLocale === "pt-BR" && pathname.startsWith("/en/news/")) {
      const slug = pathname.replace(/^\/en\/news\//, "");
      const response = await fetch(`${getApiBaseUrl()}/api/v1/news/i18n/en/${encodeURIComponent(slug)}`).catch(() => null);
      if (!response?.ok) return "/noticia";
      const data = (await response.json().catch(() => null)) as { sourceSlug?: string } | null;
      return data?.sourceSlug ? `/noticia/${data.sourceSlug}` : "/noticia";
    }

    return null;
  }

  async function localizedPath(targetLocale: Locale) {
    if (targetLocale === locale) return pathname;

    const translatedArticlePath = await getTranslatedArticlePath(targetLocale);
    if (translatedArticlePath) return translatedArticlePath;

    if (targetLocale === "en") {
      if (pathname === "/") return "/en";
      if (pathname === "/quem-somos") return "/en/about";
      if (pathname === "/cursos") return "/en/courses";
      if (pathname === "/noticia") return "/en/news";
      if (pathname.startsWith("/noticia/")) return "/en/news";
      if (pathname === "/duvidas") return "/en/faq";
      if (pathname === "/contato") return "/en/contact";
      return "/en";
    }

    if (pathname === "/en") return "/";
    if (pathname === "/en/about") return "/quem-somos";
    if (pathname === "/en/courses") return "/cursos";
    if (pathname === "/en/news") return "/noticia";
    if (pathname.startsWith("/en/news/")) return "/noticia";
    if (pathname === "/en/faq") return "/duvidas";
    if (pathname === "/en/contact") return "/contato";
    return "/";
  }

  async function changeLanguage(targetLocale: Locale) {
    window.localStorage.setItem("uailibras-locale", targetLocale);
    setIsLanguageOpen(false);
    languageButtonRef.current?.focus();
    router.push(await localizedPath(targetLocale));
  }

  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link href={locale === "en" ? "/en" : "/"} aria-label={locale === "en" ? "UaiLibras home page" : "Pagina inicial UaiLibras"}>
            <Image src={asset("06.png")} alt="Logo UaiLibras" width={250} height={220} priority />
          </Link>
        </div>
        <nav className="menu" aria-label={locale === "en" ? "Main menu" : "Menu principal"}>
          <button
            ref={menuButtonRef}
            className="hamburger"
            type="button"
            aria-expanded={isOpen}
            aria-controls="menu-list"
            aria-label={isOpen ? (locale === "en" ? "Close menu" : "Fechar menu") : locale === "en" ? "Open menu" : "Abrir menu"}
            onClick={() => setIsOpen((current) => !current)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <ul id="menu-list" ref={menuListRef} className={isOpen ? "active" : undefined}>
            {dictionary.nav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="language-switcher">
          <button
            ref={languageButtonRef}
            className="language-button"
            type="button"
            aria-expanded={isLanguageOpen}
            aria-controls="language-menu"
            aria-label={dictionary.language.label}
            onClick={() => setIsLanguageOpen((current) => !current)}
          >
            <span aria-hidden="true">🌐</span>
            <span>{locale === "en" ? "EN" : "PT"}</span>
          </button>
          {isLanguageOpen ? (
            <div id="language-menu" ref={languageMenuRef} className="language-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => void changeLanguage("pt-BR")}>
                {dictionary.language.portuguese}
              </button>
              <button type="button" role="menuitem" onClick={() => void changeLanguage("en")}>
                {dictionary.language.english}
              </button>
            </div>
          ) : null}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
