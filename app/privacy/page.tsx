import type { Metadata } from "next";

const pageTitle = "Политика конфиденциальности JyotishGPT";
const pageDescription =
  "Политика конфиденциальности самозанятого консультанта Артемия Ксорос: порядок обработки персональных данных на сайте JyotishGPT.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/privacy"
  },
  keywords: [
    "JyotishGPT",
    "политика конфиденциальности",
    "персональные данные",
    "Артемий Ксорос"
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
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

const email = "art.ksoros@gmail.com";
const phone = "+7 (991) 979-71-19";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-content space-y-10 px-4 py-16 text-sm leading-relaxed text-neutral-700 sm:px-6">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">Документ действует с 9 ноября 2024 года</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Политика конфиденциальности JyotishGPT</h1>
        <p className="text-base text-neutral-600">
          Настоящая Политика описывает порядок обработки и защиты персональных данных посетителей сайта
          <span className="whitespace-nowrap"> </span>
          <a href="https://jyotishgpt.ru" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            https://jyotishgpt.ru
          </a>
          , администрируемого самозанятым консультантом Артемием Ксорос (ИНН 500119421000, Москва, Россия).
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">1. Правовая основа и принципы</h2>
        <p>
          Обработка персональных данных осуществляется в соответствии с Федеральным законом № 152-ФЗ «О персональных данных»,
          Законом № 38-ФЗ «О рекламе» и иными применимыми нормативными актами Российской Федерации. Данные обрабатываются на
          основе добровольного согласия пользователя, только в объёме, необходимом для оказания консультаций JyotishGPT.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">2. Какие данные обрабатываются</h2>
        <p>
          Сайт не собирает и не хранит персональные данные автоматически. Любая персональная информация предоставляется
          посетителем добровольно при переходе в Telegram-каналы и чаты проекта. Дополнительно могут обрабатываться обезличенные
          технические данные: IP-адрес, сведения о браузере, параметрах устройства и маршрутах перехода, необходимые для
          аналитики работы сайта.
        </p>
        <p>
          При общении с Артемием Ксорос в Telegram пользователь может сообщить имя, никнейм, дату рождения, контактные данные и
          содержание запроса. Эти сведения используются исключительно для подготовки консультации и не сохраняются после
          завершения диалога.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">3. Цели обработки данных</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>персональный расчёт и подготовка консультаций в рамках сервиса JyotishGPT;</li>
          <li>ответы на обращения и сопровождение в Telegram;</li>
          <li>ведение внутренней аналитики, чтобы улучшать качество консультаций и контент сайта;</li>
          <li>соблюдение требований налогового законодательства РФ при расчётах с клиентами.</li>
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">4. Cookies, аналитика и AI-сервисы</h2>
        <p>
          Сайт использует файлы cookies и обезличенные аналитические сервисы (Google Analytics, Яндекс.Метрика) для оценки
          посещаемости и улучшения пользовательского опыта. Эти данные не позволяют идентифицировать конкретного человека и
          хранятся в соответствии с политиками указанных сервисов.
        </p>
        <p>
          Для генерации ответов и подготовки материалов может применяться OpenAI API и иные AI-сервисы. Передаваемые им данные
          обезличиваются и используются только для формирования консультационных материалов.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">5. Telegram и сторонние ресурсы</h2>
        <p>
          Взаимодействие с JyotishGPT происходит в стороннем приложении Telegram через контакт
          <span className="whitespace-nowrap"> </span>
          <a href="https://t.me/BAPHbl" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            @BAPHbl
          </a>
          , канал
          <span className="whitespace-nowrap"> </span>
          <a href="https://t.me/JyotishGPT" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            @JyotishGPT
          </a>
          , форум
          <span className="whitespace-nowrap"> </span>
          <a href="https://t.me/GPT_IVI" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            @GPT_IVI
          </a>
          , а также бота
          <span className="whitespace-nowrap"> </span>
          <a href="https://t.me/artemiy_ksoros_bot" className="text-accent hover:text-accent-hover" rel="noopener noreferrer">
            @artemiy_ksoros_bot
          </a>
          . Ответственность за безопасность данных в этих сервисах несёт Telegram. Артемий Ксорос использует полученную
          информацию только для целей консультации, не передаёт её третьим лицам и удаляет после завершения взаимодействия.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">6. Права пользователей</h2>
        <p>
          Пользователь вправе запросить информацию об обработке своих данных, потребовать уточнения, блокирования или удаления.
          Запросы направляются на электронную почту
          <span className="whitespace-nowrap"> </span>
          <a href={`mailto:${email}`} className="text-accent hover:text-accent-hover">
            {email}
          </a>
          <span className="whitespace-nowrap"> </span>
          либо через Telegram. Ответ предоставляется в течение 10 рабочих дней с момента получения запроса.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-surface/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.14)]">
        <h2 className="text-xl font-semibold text-neutral-900">7. Хранение и защита</h2>
        <p>
          Данные, которые пользователь добровольно сообщает в Telegram, доступны только Артемию Ксорос. Для их защиты применяются
          двухфакторная аутентификация, шифрование переписки и ограничение доступа к устройствам. Документы учёта платежей
          хранятся в сервисах, предоставленных ФНС России для самозанятых, и доступны исключительно владельцу проекта.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/70 p-6 shadow-[0_18px_44px_rgba(125,84,25,0.08)]">
        <h2 className="text-xl font-semibold text-neutral-900">8. Контакты ответственного лица</h2>
        <ul className="space-y-2">
          <li>
            Самозанятый консультант: Артемий Ксорос, ИНН 500119421000, Москва, Россия.
          </li>
          <li>
            Электронная почта: {" "}
            <a href={`mailto:${email}`} className="text-accent hover:text-accent-hover">
              {email}
            </a>
            .
          </li>
          <li>
            Телефон/Telegram: {" "}
            <a href="tel:+79919797119" className="text-accent hover:text-accent-hover">
              {phone}
            </a>
            .
          </li>
        </ul>
      </section>
    </main>
  );
}
