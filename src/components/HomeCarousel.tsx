"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Slide = {
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
};

type HomeCarouselProps = {
  slides: Slide[];
};

export function HomeCarousel({ slides }: HomeCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const showPrevious = () => {
    setIsPaused(true);
    setCurrent((index) => (index - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setIsPaused(true);
    setCurrent((index) => (index + 1) % slides.length);
  };

  return (
    <section className="hero" aria-label="Notícias em destaque">
      <div className="carousel">
        <button className="prev" type="button" aria-label="Slide anterior" onClick={showPrevious}>
          &#10094;
        </button>
        <div className="carousel-images">
          {slides.map((slide, index) => (
            <div className={`slide${index === current ? " active" : ""}`} key={slide.href} aria-hidden={index !== current}>
              <img src={slide.image} alt={slide.alt} />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <Link href={slide.href} className="btn-leia-mais" tabIndex={index === current ? 0 : -1} aria-label={`Leia mais sobre ${slide.title}`}>
                  Leia mais
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="carousel-status" aria-live="polite">
          Slide {current + 1} de {slides.length}
        </p>
        {slides.length > 1 ? (
          <button
            className="pause-toggle"
            type="button"
            aria-label={prefersReducedMotion ? "Movimento automático desativado" : isPaused ? "Continuar carrossel" : "Pausar carrossel"}
            disabled={prefersReducedMotion}
            onClick={() => setIsPaused((value) => !value)}
          >
            <i className={`fas ${isPaused ? "fa-play" : "fa-pause"}`} aria-hidden="true" />
          </button>
        ) : null}
        <button className="next" type="button" aria-label="Próximo slide" onClick={showNext}>
          &#10095;
        </button>
      </div>
    </section>
  );
}
