"use client";

import { useState } from "react";

import { questionGroups } from "../../content/question-groups";

const gradientBackground =
  "bg-gradient-to-br from-[#fff9ef]/95 via-[#fdeacd]/90 to-[#f5d99f]/95";

interface QuestionsShowcaseProps {
  className?: string;
}

export function QuestionsShowcase({ className = "" }: QuestionsShowcaseProps) {
  const groups = questionGroups;
  const [activeTitle, setActiveTitle] = useState(groups[0]?.title ?? "");
  const activeGroup = groups.find((group) => group.title === activeTitle) ?? groups[0];

  return (
    <section
      className={`relative overflow-hidden rounded-[32px] border border-[#cda15e]/30 ${gradientBackground} px-6 py-10 shadow-[0_28px_80px_rgba(125,84,25,0.16)] backdrop-blur-sm sm:px-10 ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute -top-32 left-[10%] h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,rgba(204,152,59,0.32),transparent_68%)] blur-3xl" />
        <div className="absolute bottom-[-3rem] right-[-2rem] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(194,140,44,0.26),transparent_74%)] blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="space-y-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c59a58]/30 bg-[#fff4de]/80 px-4 py-1 text-xs uppercase tracking-[0.32em] text-neutral-600">
            Вопросы
          </span>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold leading-snug text-neutral-900 md:text-[2.35rem]">
              Что можно спросить у меня как у астролога
            </h2>
            <p className="mx-auto max-w-3xl text-base text-neutral-600 md:text-lg">
              Собрала популярные темы консультаций — выберите интересующую категорию, чтобы увидеть конкретные вопросы, которые помогают прояснить ситуацию.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:items-start">
          <div className="flex flex-col gap-3">
            {groups.map((group) => {
              const isActive = group.title === activeGroup?.title;

              return (
                <button
                  key={group.title}
                  type="button"
                  onClick={() => setActiveTitle(group.title)}
                  className={`group relative flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                    isActive
                      ? "border-accent/40 bg-accent text-white shadow-[0_16px_44px_rgba(125,84,25,0.18)]"
                      : "border-[#cda15e]/30 bg-[#fff4de]/80 text-neutral-700 shadow-[0_12px_32px_rgba(125,84,25,0.12)] hover:-translate-y-[2px] hover:border-[#b78945]/40 hover:bg-[#fde7c9]"
                  }`}
                  aria-pressed={isActive}
                  aria-expanded={isActive}
                >
                  <span className="text-lg font-semibold tracking-[0.01em]">
                    {group.title}
                  </span>
                  <span
                    aria-hidden
                    className={`ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                      isActive
                        ? "border-white/40 bg-white/20 text-white"
                        : "border-[#cda15e]/30 bg-white/70 text-accent"
                    }`}
                  >
                    {isActive ? "–" : "+"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#cda15e]/30 bg-white/80 p-6 shadow-[0_20px_56px_rgba(125,84,25,0.12)] backdrop-blur">
            <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden>
              <div className="absolute left-1/2 top-[-3rem] h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(207,153,63,0.32),transparent_70%)] blur-3xl" />
              <div className="absolute bottom-[-4rem] right-[-2rem] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(198,144,48,0.24),transparent_72%)] blur-3xl" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-neutral-900 md:text-[1.75rem]">
                  {activeGroup?.title}
                </h3>
                <span className="inline-flex items-center rounded-full border border-[#cda15e]/30 bg-[#fff4de]/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-neutral-600">
                  {activeGroup?.questions.length ?? 0} вопросов
                </span>
              </div>
              <ul className="space-y-3 text-sm text-neutral-700 sm:text-base">
                {activeGroup?.questions.map((question) => (
                  <li
                    key={question}
                    className="rounded-2xl border border-transparent bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(125,84,25,0.08)] ring-1 ring-[#cda15e]/15"
                  >
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
