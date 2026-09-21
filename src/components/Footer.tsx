"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, getLocaleFromPath } from "@/i18n/dictionaries";
import packageJson from "../../package.json";

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const dictionary = getDictionary(locale);
  const newsHref = locale === "en" ? "/en/news" : "/noticia";
  const contactHref = locale === "en" ? "/en/contact" : "/contato";
  const coursesHref = locale === "en" ? "/en/courses" : "/cursos";

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h2 className="footer-heading">UaiLibras</h2>
          <p>{dictionary.footer.tagline}</p>
        </div>
        <div className="footer-column">
          <h2 className="footer-heading">{dictionary.footer.courses}</h2>
          <ul>
            {dictionary.footer.courseItems.map((course) => (
              <li key={course}>
                <Link href={coursesHref}>{course}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h2 className="footer-heading">{dictionary.footer.usefulLinks}</h2>
          <ul>
            <li>
              <Link href={newsHref}>{dictionary.news.title}</Link>
            </li>
            <li>
              <Link href={contactHref}>{dictionary.footer.contact}</Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h2 className="footer-heading">{dictionary.footer.social}</h2>
          <p className="footer-muted">{dictionary.footer.soon}</p>
        </div>
      </div>
      <div className="footer-bottom">&copy; 2026 UaiLibras &middot; v{packageJson.version}</div>
    </footer>
  );
}
