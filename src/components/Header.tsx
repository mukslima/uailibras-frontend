"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { asset, navLinks } from "@/data/site";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuListRef = useRef<HTMLUListElement | null>(null);

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

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link href="/" aria-label="Página inicial UaiLibras">
            <Image src={asset("06.png")} alt="Logo UaiLibras" width={250} height={220} priority />
          </Link>
        </div>
        <nav className="menu" aria-label="Menu principal">
          <button
            ref={menuButtonRef}
            className="hamburger"
            type="button"
            aria-expanded={isOpen}
            aria-controls="menu-list"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setIsOpen((current) => !current)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <ul id="menu-list" ref={menuListRef} className={isOpen ? "active" : undefined}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
