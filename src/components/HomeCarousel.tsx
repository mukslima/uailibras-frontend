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
  labels: {
    label: string;
    previous: string;
    next: string;
    readMore: string;
    readMoreAbout: string;
    status: string;
    pause: string;
    resume: string;
    reducedMotion: string;
  };
};

export function HomeCarousel({ labels, slides }: HomeCarouselProps) {
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
    <section className="hero" aria-label={labels.label}>
      <div className="carousel">
        <button className="prev" type="button" aria-label={labels.previous} onClick={showPrevious}>
          &#10094;
        </button>
        <div className="carousel-images">
          {slides.map((slide, index) => (
            <div className={`slide${index === current ? " active" : ""}`} key={slide.href} aria-hidden={index !== current}>
              <img src={slide.image} alt={slide.alt} />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <Link href={slide.href} className="btn-leia-mais" tabIndex={index === current ? 0 : -1} aria-label={`${labels.readMoreAbout} ${slide.title}`}>
                  {labels.readMore}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="carousel-status" aria-live="polite">
          {labels.status.replace("{current}", String(current + 1)).replace("{total}", String(slides.length))}
        </p>
        {slides.length > 1 ? (
          <button
            className="pause-toggle"
            type="button"
            aria-label={prefersReducedMotion ? labels.reducedMotion : isPaused ? labels.resume : labels.pause}
            disabled={prefersReducedMotion}
            onClick={() => setIsPaused((value) => !value)}
          >
            <i className={`fas ${isPaused ? "fa-play" : "fa-pause"}`} aria-hidden="true" />
          </button>
        ) : null}
        <button className="next" type="button" aria-label={labels.next} onClick={showNext}>
          &#10095;
        </button>
      </div>
    </section>
  );
}
