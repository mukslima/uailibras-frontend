"use client";

import { useId, useState } from "react";

type Faq = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: Faq[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div className="faq-item" key={item.question}>
            <button
              id={`${baseId}-question-${index}`}
              className={`faq-question${isOpen ? " active" : ""}`}
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${baseId}-answer-${index}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              {item.question}
              <i className={`fas ${isOpen ? "fa-minus" : "fa-plus"}`} aria-hidden="true" />
            </button>
            <div
              id={`${baseId}-answer-${index}`}
              className="faq-answer"
              role="region"
              aria-labelledby={`${baseId}-question-${index}`}
              hidden={!isOpen}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </>
  );
}
