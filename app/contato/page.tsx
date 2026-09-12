import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | UaiLibras",
  description:
    "Entre em contato com a UaiLibras para cursos de Libras, acessibilidade, eventos e serviços de inclusão.",
};

export default function ContatoPage() {
  return (
    <main>
      <section id="contato" className="contato-section">
        <div className="contato-container">
          <div className="contato-info">
            <h1>Fale conosco</h1>
            <p>
              Tem dúvidas ou sugestões?
              <br />
              Envie-nos uma mensagem.
            </p>

            <ul className="contato-lista">
              <li>
                <i className="fas fa-phone-alt" aria-hidden="true" /> Número: 31 91479896
              </li>
              <li>
                <i className="fas fa-envelope" aria-hidden="true" /> Email: contato@uailibras.com.br
              </li>
              <li>
                <i className="fab fa-instagram" aria-hidden="true" /> Instagram:{" "}
                <a href="https://www.instagram.com/uai.libras/" className="contato-link">
                  @uai.libras
                </a>
              </li>
              <li>
                <i className="fas fa-map-marker-alt" aria-hidden="true" /> Localização
                <br />
                Rua Silva Ortiz, 164, Bairro Floresta - Belo Horizonte
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
