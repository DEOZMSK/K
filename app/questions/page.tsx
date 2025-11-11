import type { Metadata } from "next";
import { Inter } from "next/font/google";
import path from "path";
import { promises as fs } from "fs";

import { CTAButton } from "../components/CTAButton";
import {
  QuestionCategory,
  QuestionsAccordion,
  QuestionItem
} from "./QuestionsAccordion";
import { siteConfig } from "../../content/site-config";
import { LegalFooter } from "../components/LegalFooter";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

const createTelegramLinkWithText = (baseLink: string, text: string) => {
  try {
    const url = new URL(baseLink);
    url.searchParams.set("text", text);
    return url.toString();
  } catch (error) {
    const separator = baseLink.includes("?") ? "&" : "?";
    return `${baseLink}${separator}text=${encodeURIComponent(text)}`;
  }
};

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

const markerEntries = CATEGORY_ORDER.map((name) => ({
  name,
  marker:
    Object.entries(CATEGORY_MARKERS).find(([, categoryName]) => categoryName === name)?.[0] ?? ""
}));

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const parseAnswer = (segment: string): string[] => {
  const withoutLabel = segment.replace(/^Ответ:\s*/i, "");
  const paragraphs = withoutLabel
    .split(/\n{2,}/)
    .map((paragraph) => normalizeWhitespace(paragraph))
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  const fallback = normalizeWhitespace(withoutLabel);
  return fallback ? [fallback] : [];
};

const parseQuestionItems = (
  sectionContent: string,
  categoryName: QuestionCategory["name"],
  usedAnchors: Set<string>
): QuestionItem[] => {
  const segments = sectionContent
    .split(/\n{2,}/)
    .map((segment) => segment.replace(/\r/g, "").trim())
    .filter(Boolean);

  const items: QuestionItem[] = [];

  for (let index = 0; index < segments.length; index++) {
    const potentialQuestion = segments[index];

    if (!potentialQuestion || /^Ответ:/i.test(potentialQuestion)) {
      continue;
    }

    const potentialAnswer = segments[index + 1];

    if (!potentialAnswer || !/^Ответ:/i.test(potentialAnswer)) {
      continue;
    }

    const questionText = normalizeWhitespace(potentialQuestion);
    const answerParagraphs = parseAnswer(potentialAnswer);

    if (!questionText || answerParagraphs.length === 0) {
      continue;
    }

    const baseAnchor =
      createSlug(`${categoryName} ${questionText}`) || createSlug(`${categoryName}-${index + 1}`);
    const fallbackAnchor = `question-${createSlug(categoryName) || "category"}-${index + 1}`;
    const anchorBase = baseAnchor || fallbackAnchor;
    let anchorId = anchorBase;
    let duplicateCounter = 2;

    while (usedAnchors.has(anchorId)) {
      anchorId = `${anchorBase}-${duplicateCounter}`;
      duplicateCounter += 1;
    }

    usedAnchors.add(anchorId);

    items.push({
      anchorId,
      question: questionText,
      answer: answerParagraphs
    });
  }

  return items;
};

async function readQuestionsSource(): Promise<string> {
  const baseFileName = "Что можно спросить_.txt";
  const fallbackFileName = "Что можно спросить_ (1).txt";

  const tryRead = async (fileName: string) => {
    const filePath = path.join(process.cwd(), fileName);

    try {
      const content = await fs.readFile(filePath, "utf8");
      return { content, exists: true } as const;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError?.code === "ENOENT") {
        return { content: "", exists: false } as const;
      }

      throw error;
    }
  };

  const primary = await tryRead(baseFileName);
  if (primary.exists && /Ответ:/i.test(primary.content)) {
    return primary.content;
  }

  const fallback = await tryRead(fallbackFileName);
  if (fallback.exists && fallback.content) {
    return fallback.content;
  }

  if (primary.exists) {
    return primary.content;
  }

  throw new Error(
    `Не удалось найти файл с вопросами. Ожидаемые имена: "${baseFileName}" или "${fallbackFileName}".`
  );
}

async function getQuestionCategories(): Promise<QuestionCategory[]> {
  const rawContent = await readQuestionsSource();
  const usedAnchors = new Set<string>();

  const categories: QuestionCategory[] = markerEntries
    .map(({ name, marker }, index) => {
      if (!marker) {
        return null;
      }

      const markerPosition = rawContent.indexOf(marker);
      if (markerPosition === -1) {
        return null;
      }

      const sectionStart = markerPosition + marker.length;
      let sectionEnd = rawContent.length;

      for (let nextIndex = index + 1; nextIndex < markerEntries.length; nextIndex++) {
        const nextMarker = markerEntries[nextIndex]?.marker;
        if (!nextMarker) {
          continue;
        }

        const nextMarkerPosition = rawContent.indexOf(nextMarker, sectionStart);
        if (nextMarkerPosition !== -1) {
          sectionEnd = nextMarkerPosition;
          break;
        }
      }

      const sectionContent = rawContent.slice(sectionStart, sectionEnd).trim();
      const questions = parseQuestionItems(sectionContent, name, usedAnchors);

      if (questions.length === 0) {
        return null;
      }

      const anchorId = createSlug(`category-${name}`) || `category-${name.toLowerCase()}`;

      return {
        name,
        anchorId,
        questions
      } satisfies QuestionCategory;
    })
    .filter((category): category is QuestionCategory => Boolean(category));

  return categories;
}

export const metadata: Metadata = {
  title: "Вопросы к JyotishGPT — AI-нумерология Артемия Ксорос",
  description:
    "Каталог живых вопросов к JyotishGPT: ведическая нумерология, астрология и самоанализ с участием Артемия Ксорос.",
  alternates: {
    canonical: "/questions"
  },
  keywords: [
    "JyotishGPT",
    "вопросы JyotishGPT",
    "Артемий Ксорос",
    "AI-нумерология",
    "ведическая астрология",
    "самоанализ",
    "ведические знания"
  ],
  openGraph: {
    title: "Вопросы к JyotishGPT — AI-нумерология Артемия Ксорос",
    description:
      "Официальный перечень тем, с которыми обращаются к JyotishGPT: от быта и отношений до карьеры и личной миссии.",
    url: "/questions",
    images: [
      {
        url: "/kcopoc.jpeg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Вопросы к JyotishGPT — AI-нумерология Артемия Ксорос",
    description:
      "Официальный перечень тем, с которыми обращаются к JyotishGPT: от быта и отношений до карьеры и личной миссии.",
    images: [
      {
        url: "/kcopoc.jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  }
};

export default async function QuestionsPage() {
  const categories = await getQuestionCategories();
  const defaultTelegramMessage = "Привет! А какие ресурсы у вас есть?";
  const heroTelegramLink = createTelegramLinkWithText(
    siteConfig.telegramLink,
    defaultTelegramMessage
  );
  const heroCtaLabel = siteConfig.hero.ctaLabel?.trim() || "Написать мне";
  const snippetText =
    "JyotishGPT — официальная AI-система Артемия Ксорос. Здесь собраны живые темы, на которые ведический интеллект отвечает в диалоге: от быта и финансов до предназначения.";
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.questions.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer.join("\n\n")
        }
      }))
    )
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://jyotishgpt.ru/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Вопросы",
        item: "https://jyotishgpt.ru/questions"
      }
    ]
  };

  return (
    <main
      className={`${inter.className} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fdf6e8] via-[#f8e6c9] to-[#f3d9aa] text-neutral-900`}
    >
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
          <nav aria-label="Хлебные крошки" className="text-xs uppercase tracking-[0.24em] text-neutral-400 sm:text-sm">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a href="/" className="transition hover:text-neutral-700">
                  Главная
                </a>
              </li>
              <li aria-hidden className="text-neutral-300">
                /
              </li>
              <li aria-current="page" className="font-semibold text-neutral-600">
                Вопросы
              </li>
            </ol>
          </nav>
          <div>
            <CTAButton
              href="/"
              variant="secondary"
              newTab={false}
              analyticsEvent="click_questions_back"
              className="w-full justify-center px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] border-[#c59a58]/20 bg-[#fff8eb] text-neutral-900 hover:bg-[#fbe9c7] shadow-none hover:shadow-none sm:w-auto sm:justify-start"
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
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-neutral-500 sm:text-sm">
              JyotishGPT · нумерология · астрология · Артемий Ксорос · AI · самоанализ · ведические знания
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
              {snippetText}
            </p>
            {categories.length > 0 && (
              <div className="mt-6 rounded-3xl border border-[#d9b16f]/30 bg-white/50 p-5 shadow-[0_12px_32px_rgba(125,84,25,0.08)] backdrop-blur-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500 sm:text-base">
                  Категории вопросов
                </h2>
                <nav aria-label="Содержание страницы" className="mt-4">
                  <ul className="grid gap-2 text-sm text-neutral-700 sm:grid-cols-2 sm:gap-3 sm:text-base">
                    {categories.map((category) => (
                      <li key={`${category.anchorId}-toc`}>
                        <a
                          href={`#${category.anchorId}`}
                          className="inline-flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/70 px-4 py-3 font-medium transition hover:border-[#c59a58]/35 hover:bg-white"
                        >
                          <span>{category.name}</span>
                          <span className="text-xs uppercase tracking-[0.28em] text-[#b98a44]">→</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
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

        <div className="pb-14 text-center text-sm text-neutral-600 sm:text-base">
          <p className="mx-auto max-w-2xl leading-relaxed text-neutral-600">
            Если пока не чувствуешь, что время для личного общения пришло — можешь попробовать бота. Бот не хранит данные, и я не вижу, что ты туда вводишь.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <CTAButton
              href="https://t.me/artemiy_ksoros_bot"
              variant="glow"
              analyticsEvent="click_questions_bot"
              className="px-8 py-3.5 text-base shadow-[0_22px_70px_rgba(125,84,25,0.22)] sm:text-lg"
            >
              Попробовать бота
            </CTAButton>
            <div className="text-xs font-semibold uppercase tracking-[0.32em] text-neutral-400 sm:text-sm">
              или напиши мне
            </div>
            <CTAButton
              href={heroTelegramLink}
              variant="glow"
              className="px-8 py-3.5 text-lg shadow-[0_22px_70px_rgba(125,84,25,0.22)]"
            >
              {heroCtaLabel}
            </CTAButton>
          </div>
        </div>
      </div>
      <LegalFooter />
      {Array.isArray(faqStructuredData.mainEntity) && faqStructuredData.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
    </main>
  );
}
