import Link from "next/link";

export const metadata = {
  title: "Политика конфиденциальности",
  description: "Как mr.Kcopoc использует и хранит персональные данные посетителей."
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-content space-y-6 px-4 py-16 text-sm text-muted sm:px-6">
      <h1 className="text-3xl font-semibold text-neutral-900">Политика конфиденциальности</h1>
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
          <li>Подготовка консультаций и персональных предложений.</li>
          <li>Отправка лид-магнитов по email и в Telegram-бота.</li>
          <li>Сегментация и аналитика во внутренних отчётах и Google Sheets.</li>
        </ul>
      </section>
      <section className="space-y-4 rounded-3xl border border-outline/60 bg-surface/60 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">Хранение и удаление</h2>
        <p>
          Ответы попадают в Google Sheets (Google Workspace). Доступ ограничен владельцем проекта. Запрос на удаление можно
          отправить на{" "}
          <a href="mailto:hi@example.com" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            hi@example.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
