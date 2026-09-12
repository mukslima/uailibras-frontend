import Link from "next/link";
import { footerCourses } from "@/data/site";
import packageJson from "../../package.json";

export function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h2 className="footer-heading">UaiLibras</h2>
          <p>Comunicar, Aprender & Incluir</p>
        </div>
        <div className="footer-column">
          <h2 className="footer-heading">Cursos</h2>
          <ul>
            {footerCourses.map((course) => (
              <li key={course}>
                <Link href="/cursos">{course}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h2 className="footer-heading">Links úteis</h2>
          <ul>
            <li>
              <Link href="/noticia">Notícias</Link>
            </li>
            <li>
              <Link href="/contato">Contato</Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h2 className="footer-heading">Redes Sociais</h2>
          <p className="footer-muted">Em breve.</p>
        </div>
      </div>
      <div className="footer-bottom">&copy; 2026 UaiLibras &middot; v{packageJson.version}</div>
    </footer>
  );
}
