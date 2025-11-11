"use client";

import { useState } from "react";

export interface QuestionAnswer {
  question: string;
  answer: string;
  anchor: string;
}

export interface QuestionCategory {
  name: string;
  entries: QuestionAnswer[];
  anchor: string;
}

interface QuestionsAccordionProps {
  categories: QuestionCategory[];
}

export function QuestionsAccordion({ categories }: QuestionsAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestionByCategory, setOpenQuestionByCategory] = useState<
    Record<string, string | null>
  >({});

  const handleToggle = (name: string) => {
    setOpenCategory((current) => (current === name ? null : name));
    setOpenQuestionByCategory((current) => {
      if (current[name] == null) {
        return current;
      }

      const nextState = { ...current };
      nextState[name] = null;
      return nextState;
    });
  };

  const handleQuestionToggle = (categoryName: string, anchor: string) => {
    setOpenQuestionByCategory((current) => {
      const currentAnchor = current[categoryName] ?? null;
      return {
        ...current,
        [categoryName]: currentAnchor === anchor ? null : anchor
      };
    });
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isOpen = openCategory === category.name;
        const openedQuestionAnchor = openQuestionByCategory[category.name] ?? null;

        return (
          <div
            key={category.name}
            id={category.anchor}
            className="overflow-hidden rounded-3xl border border-[#cda15e]/35 bg-[#fff4de]/85 shadow-[0_18px_46px_rgba(125,84,25,0.12)] backdrop-blur-sm transition-colors duration-300 hover:border-[#b78945]/45 hover:bg-[#fde7c9]"
          >
            <button
              type="button"
              onClick={() => handleToggle(category.name)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold tracking-[0.01em] text-neutral-900 sm:text-xl"
            >
              <span>{category.name}</span>
              <span
                aria-hidden
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#c59a58]/30 bg-white/80 text-base text-neutral-700 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-3 px-6 pb-6 text-base leading-relaxed text-neutral-700 sm:text-lg">
                  {category.entries.map((entry) => {
                    const questionIsOpen = openedQuestionAnchor === entry.anchor;

                    return (
                      <li
                        key={entry.anchor}
                        id={entry.anchor}
                        className="relative rounded-2xl border border-transparent bg-white/60 shadow-[0_10px_28px_rgba(125,84,25,0.08)] transition hover:border-[#c59a58]/25 hover:bg-white/80"
                      >
                        <button
                          type="button"
                          onClick={() => handleQuestionToggle(category.name, entry.anchor)}
                          aria-expanded={questionIsOpen}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-neutral-900 sm:text-lg"
                        >
                          <span>{entry.question}</span>
                          <span
                            aria-hidden
                            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#c59a58]/30 bg-white/80 text-sm text-neutral-700 transition-transform duration-300 ${
                              questionIsOpen ? "rotate-45" : ""
                            }`}
                          >
                            +
                          </span>
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                            questionIsOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden border-t border-[#d9b16f]/35 bg-white/70 px-5 py-4 text-sm text-neutral-700 sm:text-base">
                            {entry.answer.split(/\n{2,}/).map((paragraph, index) => (
                              <p key={index} className={index > 0 ? "mt-3" : undefined}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
