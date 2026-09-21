import { getDictionary, type Locale } from "@/i18n/dictionaries";

export function ContactContent({ locale = "pt-BR" }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const contact = dictionary.contactPage;

  return (
    <main>
      <section id="contato" className="contato-section">
        <div className="contato-container">
          <div className="contato-info">
            <h1>{contact.title}</h1>
            <p>{contact.text}</p>

            <ul className="contato-lista">
              {contact.phoneLabel ? (
                <li>
                  <i className="fas fa-phone-alt" aria-hidden="true" /> {contact.phoneLabel} 31 91479896
                </li>
              ) : null}
              <li>
                <i className="fas fa-envelope" aria-hidden="true" /> {contact.emailLabel} contato@uailibras.com.br
              </li>
              {contact.instagramLabel ? (
                <li>
                  <i className="fab fa-instagram" aria-hidden="true" /> {contact.instagramLabel}{" "}
                  <a href="https://www.instagram.com/uai.libras/" className="contato-link">
                    @uai.libras
                  </a>
                </li>
              ) : null}
              {contact.locationLabel ? (
                <li>
                  <i className="fas fa-map-marker-alt" aria-hidden="true" /> {contact.locationLabel}
                  <br />
                  Rua Silva Ortiz, 164, Bairro Floresta - Belo Horizonte
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
