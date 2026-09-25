"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { asset } from "@/data/site";

type UaiLibrasLoaderProps = {
  label?: string;
};

const visualDelayMs = 700;

export function UaiLibrasLoader({ label = "Carregando conteudo / Loading content" }: UaiLibrasLoaderProps) {
  const [reduceMotion, setReduceMotion] = useState(true);
  const [showVisual, setShowVisual] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowVisual(true), visualDelayMs);

    return () => window.clearTimeout(timer);
  }, []);

  if (!showVisual) {
    return (
      <span className="visually-hidden" role="status" aria-live="polite">
        {label}
      </span>
    );
  }

  return (
    <div className="uailibras-loader" role="status" aria-live="polite" aria-label={label}>
      {reduceMotion ? (
        <Image className="uailibras-loader-static" src={asset("06.png")} alt="" width={120} height={120} aria-hidden="true" />
      ) : (
        <video
          className="uailibras-loader-animation"
          src={asset("uai-animacao-alpha.webm")}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          aria-hidden="true"
        />
      )}
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
