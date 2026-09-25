"use client";

import { useEffect, useState } from "react";
import { UaiLibrasLoader } from "@/components/UaiLibrasLoader";

const previewDurationMs = 5700;

export function DebugLoaderPreview() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("debugLoader") !== "1") return;

    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), previewDurationMs);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="debug-loader-surface">
      <UaiLibrasLoader label="Visualizacao de carregamento" />
    </div>
  );
}
