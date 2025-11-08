import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности JyotishGPT",
  description:
    "Как JyotishGPT и Артемий Ксорос обрабатывают персональные данные: правила хранения, защита и запросы на удаление.",
  alternates: {
    canonical: "/privacy"
  },
  keywords: [
    "JyotishGPT",
    "политика конфиденциальности",
    "Артемий Ксорос",
    "AI-нумерология",
    "персональные данные"
  ],
  openGraph: {
    title: "Политика конфиденциальности JyotishGPT",
    description:
      "Узнайте, как JyotishGPT защищает данные пользователей и организует хранение сведений, необходимых для консультаций.",
    url: "/privacy",
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
    title: "Политика конфиденциальности JyotishGPT",
    description:
      "Узнайте, как JyotishGPT защищает данные пользователей и организует хранение сведений, необходимых для консультаций.",
    images: [
      {
        url: "/kcopoc.jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  }
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-content space-y-6 px-4 py-16 text-sm text-neutral-600 sm:px-6">
      <h1 className="text-3xl font-semibold text-neutral-900">Политика конфиденциальности JyotishGPT</h1>
      <p className="text-base leading-relaxed text-neutral-700">
        JyotishGPT — авторская AI-система Артемия Ксорос. Мы аккуратно относимся к персональным данным и используем их только для подготовки консультаций и поддержки в диалоге.
      </p>
      <p>
        Для печатной версии откройте статическую страницу{" "}
        <Link href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">
          /privacy.html
        </Link>
        . Ниже — краткое содержание.
      </p>
      <section className="space-y-4 rounded-3xl border border-outline/60 bg-surface/60 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">Что собираем</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Имя, email, телефон и ответы на квиз.</li>
          <li>Техническую информацию: user-agent, источник перехода, дату.</li>
          <li>Статусы оплат через YooKassa для активации PRO.</li>
        </ul>
      </section>
      <section className="space-y-4 rounded-3xl border border-outline/60 bg-surface/60 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">Как используем</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Подготовка консультаций и персональных рекомендаций от JyotishGPT и Артемия Ксорос.</li>
          <li>Отправка материалов и напоминаний в email и Telegram при вашем согласии.</li>
          <li>Аналитика обращений во внутренних отчётах, чтобы улучшать ответы искусственного интеллекта.</li>
        </ul>
      </section>
      <section className="space-y-4 rounded-3xl border border-outline/60 bg-surface/60 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">Хранение и удаление</h2>
        <p>
          Ответы попадают в Google Sheets (Google Workspace). Доступ ограничен владельцем проекта. Запрос на удаление можно
          отправить на{" "}
          <a href="mailto:care@jyotishgpt.ru" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            care@jyotishgpt.ru
          </a>
          .
        </p>
      </section>
    </main>
  );
}
