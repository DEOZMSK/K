import type { Metadata } from "next";
import path from "path";
import { promises as fs } from "fs";

import { CTAButton } from "../components/CTAButton";
import { QuestionsAccordion, QuestionCategory } from "./QuestionsAccordion";

const CATEGORY_ORDER: QuestionCategory["name"][] = [
  "Быт",
  "Работа",
  "Деньги",
  "Бизнес",
  "Отношения",
  "Образование",
  "О себе"
];

const CATEGORY_DESCRIPTIONS: { name: QuestionCategory["name"]; description: string }[] = [
  {
    name: "Быт",
    description:
      "повседневная жизнь, привычки, одежда, ароматы, праздники, удача, переезд, домашние животные, мотивация, самочувствие, планы на день, выбор времени и цвета"
  },
  {
    name: "Работа",
    description:
      "поиск и смена работы, собеседования, карьерный рост, отношения с коллегами и руководством, выбор профессии, уверенность, повышение, увольнение"
  },
  {
    name: "Деньги",
    description:
      "кредиты, накопления, финансовая независимость, расходы, подарки, распределение бюджета, доход, наследство, инвестиции, ссоры из-за денег"
  },
  {
    name: "Бизнес",
    description:
      "начало или развитие дела, партнёрство, клиенты, кризисы, инвестиции, расширение, налоги, конкуренты, стратегия, мотивация персонала"
  },
  {
    name: "Отношения",
    description:
      "любовь, верность, брак, развод, доверие, знакомства, чувства, дети, свадьба, совместимость, расставания, ревность"
  },
  {
    name: "Образование",
    description:
      "поступление, экзамены, университет, преподаватели, отношения с одноклассниками, выбор специальности, стажировки, оценки, стипендии"
  },
  {
    name: "О себе",
    description:
      "личность, предназначение, уверенность, духовность, проклятия, миссия, цель жизни, здоровье, внутренние состояния, мотивация, кристаллы, числа удачи"
  }
];

const CATEGORY_MARKERS: Record<string, QuestionCategory["name"]> = {
  'Вот все вопросы из группы "Быт":': "Быт",
  'Вот все вопросы из группы "Работа":': "Работа",
  'Вот все вопросы из группы "Деньги":': "Деньги",
  'Вот все вопросы из группы "Бизнес":': "Бизнес",
  'Вот все вопросы из группы "Отношения":': "Отношения",
  'Вот все вопросы из группы "Образование":': "Образование",
  'Вот все вопросы из группы "О себе":': "О себе"
};

async function getQuestionCategories(): Promise<QuestionCategory[]> {
  const filePath = path.join(process.cwd(), "Что можно спросить_.txt");
  const rawContent = await fs.readFile(filePath, "utf8");
  const categoriesMap = new Map<QuestionCategory["name"], string[]>();

  CATEGORY_ORDER.forEach((name) => {
    categoriesMap.set(name, []);
  });

  let currentCategory: QuestionCategory["name"] = "Быт";
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    const question = buffer.join(" ").replace(/\s+/g, " ").trim();
    if (question && question !== "...") {
      const target = categoriesMap.get(currentCategory);
      if (target) {
        target.push(question);
      }
    }
    buffer = [];
  };

  let processingStarted = false;

  rawContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushBuffer();
      return;
    }

    const markerCategory = CATEGORY_MARKERS[trimmed];
    if (markerCategory) {
      flushBuffer();
      currentCategory = markerCategory;
      processingStarted = true;
      return;
    }

    if (!processingStarted) {
      return;
    }

    if (trimmed === "...") {
      return;
    }

    buffer.push(trimmed);
  });

  flushBuffer();

  return CATEGORY_ORDER.map((name) => ({
    name,
    questions: categoriesMap.get(name)?.filter(Boolean) ?? []
  })).filter((category) => category.questions.length > 0);
}

export const metadata: Metadata = {
  title: "Что можно спросить — Артемий Ксорос",
  description:
    "Популярные вопросы, с которыми приходят за поддержкой: от быта и работы до отношений и личного роста."
};

export default async function QuestionsPage() {
  const categories = await getQuestionCategories();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fdf6e8] via-[#f8e6c9] to-[#f3d9aa] text-neutral-900">
      <div className="pointer-events-none absolute inset-0">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(215,174,92,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(215,174,92,0.18) 1px, transparent 1px)",
            backgroundSize: "90px 90px"
          }}
        />
        <div
          aria-hidden
          className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,165,78,0.28),transparent_72%)] blur-3xl"
        />
        <div
          aria-hidden
          className="absolute bottom-[-5rem] right-[-3rem] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,149,58,0.28),transparent_76%)] blur-3xl"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-40 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(193,138,46,0.3),transparent_74%)] blur-[120px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-14 sm:gap-14 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-6">
          <div>
            <CTAButton
              href="/"
              variant="secondary"
              newTab={false}
              analyticsEvent="click_questions_back"
              className="w-full justify-center px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] sm:w-auto sm:justify-start"
            >
              Назад
            </CTAButton>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
              Что можно спросить?
            </h1>
            <p className="mt-3 text-base text-neutral-600 sm:text-lg">
              Подборка живых вопросов, с которыми чаще всего приходят: выбери категорию, чтобы увидеть идеи для старта разговора.
            </p>
            <div className="mt-6 grid gap-4 text-sm text-neutral-600 sm:grid-cols-2 sm:gap-5 sm:text-base">
              {CATEGORY_DESCRIPTIONS.map(({ name, description }) => (
                <div
                  key={name}
                  className="rounded-2xl border border-[#d9b16f]/35 bg-white/60 p-4 shadow-[0_10px_24px_rgba(125,84,25,0.08)]"
                >
                  <div className="text-base font-semibold text-neutral-900 sm:text-lg">{name}</div>
                  <p className="mt-2 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <QuestionsAccordion categories={categories} />

        <div className="pb-10 text-center text-sm text-neutral-500 sm:text-base">
          Наш диалог всегда можно начать с простого «привет» — дальше мы разберёмся вместе.
        </div>
      </div>
    </main>
  );
}
