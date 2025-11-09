import type { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Пользовательское соглашение JyotishGPT";
const pageDescription =
  "Пользовательское соглашение и согласие на обработку персональных данных для посетителей сайта JyotishGPT и клиентов Артемия Ксорос.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/terms"
  },
  keywords: [
    "JyotishGPT",
    "пользовательское соглашение",
    "согласие на обработку персональных данных",
    "Артемий Ксорос"
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/terms",
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
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: "/kcopoc.jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  }
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-content space-y-10 px-4 py-16 text-sm leading-relaxed text-neutral-700 sm:px-6">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">Редакция от 9 ноября 2024 года</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Пользовательское соглашение и согласие на обработку данных</h1>
        <p className="text-base text-neutral-600">
          Настоящий документ является публичной офертой самозанятого консультанта Артемия Ксорос (ИНН 500119421000) и определяет
          условия использования материалов сайта JyotishGPT и взаимодействия через Telegram-ресурсы проекта.
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">1. Термины и стороны</h2>
        <p>
          «Исполнитель» — самозанятый консультант Артемий Ксорос. «Пользователь» — любое лицо, которое посещает сайт
          <a href="https://jyotishgpt.ru" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            <span className="whitespace-nowrap"> https://jyotishgpt.ru</span>
          </a>
          , просматривает материалы или обращается за консультацией через Telegram.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">2. Предмет соглашения</h2>
        <p>
          Исполнитель предоставляет информационно-консультационные услуги в сфере ведической астрологии, нумерологии и
          саморазвития с использованием AI-инструментов под брендом «JyotishGPT». Сайт выполняет функцию публичного информационного
          ресурса, а обмен персональными данными происходит исключительно в Telegram.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">3. Права и обязанности сторон</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Пользователь обязуется предоставлять достоверную информацию и использовать материалы сайта только в личных целях.</li>
          <li>Исполнитель вправе обновлять методики и стоимость консультаций без предварительного уведомления, сохраняя доступ к архиву материалов.</li>
          <li>Исполнитель не несёт ответственности за решения, которые пользователь принимает на основе консультаций, и рекомендует воспринимать их как аналитическую поддержку, а не медицинский или финансовый совет.</li>
          <li>Пользователь соглашается соблюдать нормы законодательства РФ, в том числе о персональных данных и интеллектуальной собственности.</li>
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">4. Персональные данные и согласие</h2>
        <p>
          Передавая информацию через Telegram-контакты проекта, пользователь подтверждает своё согласие на обработку персональных
          данных Исполнителем в целях оказания консультации, взаимодействия по запросу и исполнения обязательств по расчётам.
        </p>
        <p>
          Данные не передаются третьим лицам без отдельного согласия пользователя. Порядок обработки описан в
          <Link href="/privacy" className="text-accent hover:text-accent-hover">
            <span className="whitespace-nowrap"> Политике конфиденциальности</span>
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">5. Расчёты и ответственность</h2>
        <p>
          Оплата консультаций производится через официальные инструменты самозанятого (например, «Мой налог», YooKassa, платежные
          формы Telegram). Исполнитель предоставляет электронный чек по запросу пользователя. Отказ от консультации возможен до
          момента согласования даты и темы встречи; уплаченные средства возвращаются за вычетом фактически понесённых расходов.
        </p>
        <p>
          Исполнитель не гарантирует конкретный результат: консультация представляет собой экспертное мнение и аналитическую
          помощь. Пользователь несёт ответственность за принятые решения и последствия их реализации.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">6. Cookies и внешние сервисы</h2>
        <p>
          Используя сайт, пользователь подтверждает ознакомление с тем, что применяются файлы cookies, сервисы аналитики (Google
          Analytics, Яндекс.Метрика) и AI-платформы (OpenAI API). Эти инструменты помогают улучшать качество материалов и не
          ограничивают доступ к основному контенту.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">7. Финальные положения</h2>
        <p>
          Соглашение вступает в силу с момента первого посещения сайта или обращения к Исполнителю и действует до момента
          прекращения взаимодействия. Все споры разрешаются путём переговоров; при невозможности договориться они рассматриваются
          в соответствии с законодательством Российской Федерации.
        </p>
        <p>
          Вопросы, связанные с использованием материалов, можно направить на адрес электронной почты
          <span className="whitespace-nowrap"> </span>
          <a href="mailto:art.ksoros@gmail.com" className="text-accent hover:text-accent-hover">
            art.ksoros@gmail.com
          </a>
          <span className="whitespace-nowrap"> </span>
          или через Telegram контакт
          <span className="whitespace-nowrap"> </span>
          <a href="https://t.me/BAPHbl" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            @BAPHbl
          </a>
          .
        </p>
      </section>
    </main>
  );
}
