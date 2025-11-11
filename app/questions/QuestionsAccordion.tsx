"use client";

import { useState } from "react";

export interface QuestionCategory {
  name: string;
  anchorId: string;
  questions: QuestionItem[];
}

interface QuestionsAccordionProps {
  categories: QuestionCategory[];
}

export interface QuestionItem {
  anchorId: string;
  question: string;
  answer: string[];
}

export function QuestionsAccordion({ categories }: QuestionsAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const handleCategoryToggle = (name: string) => {
    setOpenQuestionId(null);
    setOpenCategory((current) => (current === name ? null : name));
  };

  const handleQuestionToggle = (categoryName: string, questionId: string) => {
    setOpenCategory(categoryName);
    setOpenQuestionId((current) => (current === questionId ? null : questionId));
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const isOpen = openCategory === category.name;

        return (
          <div
            key={category.name}
            id={category.anchorId}
            className="overflow-hidden rounded-3xl border border-[#cda15e]/35 bg-[#fff4de]/85 shadow-[0_18px_46px_rgba(125,84,25,0.12)] backdrop-blur-sm transition-colors duration-300 hover:border-[#b78945]/45 hover:bg-[#fde7c9]"
          >
            <button
              type="button"
              onClick={() => handleCategoryToggle(category.name)}
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
                  {category.questions.map((item) => {
                    const questionIsOpen = openQuestionId === item.anchorId && isOpen;

                    return (
                      <li
                        key={item.anchorId}
                        id={item.anchorId}
                        className="relative rounded-2xl border border-transparent bg-white/60 shadow-[0_10px_28px_rgba(125,84,25,0.08)] transition hover:border-[#c59a58]/25 hover:bg-white/80"
                      >
                        <button
                          type="button"
                          onClick={() => handleQuestionToggle(category.name, item.anchorId)}
                          aria-expanded={questionIsOpen}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-neutral-900 sm:text-lg"
                        >
                          <span>{item.question}</span>
                          <span
                            aria-hidden
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#c59a58]/30 bg-white/90 text-sm text-neutral-700 transition-transform duration-300 ${
                              questionIsOpen ? "rotate-45" : ""
                            }`}
                          >
                            +
                          </span>
                        </button>
                        <div
                          className={`grid px-5 pb-0 transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                            questionIsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden pb-5">
                            <div className="space-y-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
                              {item.answer.map((paragraph, index) => (
                                <p key={`${item.anchorId}-paragraph-${index}`}>{paragraph}</p>
                              ))}
                            </div>
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
