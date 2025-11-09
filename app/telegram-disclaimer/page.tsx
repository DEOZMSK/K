import type { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Дисклеймер о Telegram";
const pageDescription =
  "Информация о том, как происходит общение с JyotishGPT в Telegram, и кто несёт ответственность за обработку персональных данных.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/telegram-disclaimer"
  },
  keywords: [
    "JyotishGPT",
    "Telegram дисклеймер",
    "обработка персональных данных",
    "Артемий Ксорос"
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/telegram-disclaimer",
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

export default function TelegramDisclaimerPage() {
  return (
    <main className="mx-auto max-w-content space-y-10 px-4 py-16 text-sm leading-relaxed text-neutral-700 sm:px-6">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">Обновлено 9 ноября 2024 года</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Дисклеймер о Telegram и сторонних сервисах</h1>
        <p className="text-base text-neutral-600">
          JyotishGPT ведёт коммуникацию с пользователями через Telegram. Ниже описаны правила обмена данными и пределы
          ответственности Артемия Ксорос и платформы Telegram.
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">1. Каналы связи</h2>
        <p>Для общения используются следующие ресурсы Telegram:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Личный контакт Артемия Ксорос —{" "}
            <a href="https://t.me/BAPHbl" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
              @BAPHbl
            </a>
            .
          </li>
          <li>
            Канал бренда —{" "}
            <a href="https://t.me/JyotishGPT" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
              @JyotishGPT
            </a>
            .
          </li>
          <li>
            Форум для обсуждений —{" "}
            <a href="https://t.me/GPT_IVI" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
              @GPT_IVI
            </a>
            .
          </li>
          <li>
            Бот консультаций —{" "}
            <a
              href="https://t.me/artemiy_ksoros_bot"
              className="text-accent hover:text-accent-hover"
              rel="noopener noreferrer"
            >
              @artemiy_ksoros_bot
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">2. Роли и ответственность</h2>
        <p>
          Telegram является самостоятельным оператором данных и несёт ответственность за техническую защиту информации,
          отправляемой через свои сервисы, в рамках собственных условий использования. Артемий Ксорос действует как самозанятый
          консультант и использует Telegram исключительно как канал связи.
        </p>
      </section>
      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">3. Какие данные могут передаваться</h2>
        <p>
          Пользователь самостоятельно решает, какую информацию отправлять в чат или боту. Обычно это имя или никнейм, дата
          рождения, контактные данные, описание запроса и материалы для анализа. Предоставляя их, пользователь соглашается с тем,
          что обработка проводится в интерфейсе Telegram.
        </p>
        <p>
          Артемий Ксорос использует переданные сведения исключительно для подготовки расчётов и рекомендаций, не передаёт их
          третьим лицам и не сохраняет после завершения консультации, за исключением случаев, когда законодательство требует иного
          (например, хранение учётных документов о платежах).
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">4. Рекомендации по безопасности</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Используйте официальные приложения Telegram и включите двухфакторную аутентификацию.</li>
          <li>Не отправляйте паспортные данные, банковские реквизиты и иную чувствительную информацию в открытых чатах.</li>
          <li>Закрывайте диалог после завершения консультации, если не хотите хранить переписку в своём аккаунте.</li>
          <li>
            В случае подозрительной активности сразу сообщите на{" "}
            <a href="mailto:art.ksoros@gmail.com" className="text-accent hover:text-accent-hover">
              art.ksoros@gmail.com
            </a>{" "}
            или в личные сообщения
            <span className="whitespace-nowrap"> </span>
            <a href="https://t.me/BAPHbl" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
              @BAPHbl
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">5. Связанные документы</h2>
        <p>
          Дополнительные правила обработки данных изложены в
          <Link href="/privacy" className="text-accent hover:text-accent-hover">
            <span className="whitespace-nowrap"> Политике конфиденциальности</span>
          </Link>{" "}
          и в
          <Link href="/terms" className="text-accent hover:text-accent-hover">
            <span className="whitespace-nowrap"> Пользовательском соглашении</span>
          </Link>
          . Используя Telegram-ресурсы проекта, пользователь подтверждает, что ознакомился с этими документами.
        </p>
      </section>
    </main>
  );
}
