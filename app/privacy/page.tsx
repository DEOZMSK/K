import type { Metadata } from "next";
import Link from "next/link";

import { LegalFooter } from "../components/LegalFooter";

export const metadata: Metadata = {
  title: "Политика конфиденциальности JyotishGPT",
  description:
    "Как самозанятый консультант Артемий Ксорос собирает, использует и защищает персональные данные пользователей JyotishGPT и Telegram-бота.",
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
      "Политика конфиденциальности самозанятого консультанта Артемия Ксорос: категории данных, сроки хранения, права пользователей и работа с Telegram.",
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
      "Политика конфиденциальности самозанятого консультанта Артемия Ксорос: категории данных, сроки хранения, права пользователей и работа с Telegram.",
    images: [
      {
        url: "/kcopoc.jpeg",
        alt: "Портрет Артемия Ксорос"
      }
    ]
  }
};

const legalContacts = {
  inn: "500119421000",
  email: "art.ksoros@gmail.com",
  phone: "+7 (991) 979-71-19",
  telegram: "@BAPHbl"
};

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-7 text-neutral-700 sm:px-6">
      <header className="space-y-3 text-neutral-900">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">Юридические документы</p>
        <h1 className="text-3xl font-semibold">Политика конфиденциальности</h1>
        <p className="max-w-2xl text-base text-neutral-600">
          Документ подготовлен в соответствии с Федеральным законом РФ №152-ФЗ «О персональных данных», Федеральным законом №149-ФЗ
          «Об информации, информационных технологиях и о защите информации» и иным действующим законодательством Российской Федерации.
        </p>
        <p className="text-sm text-neutral-500">
          Самозанятый консультант: <strong>Артемий Ксорос</strong> (ИНН {legalContacts.inn}), Москва, Россия. Контакты: <a
            href="mailto:art.ksoros@gmail.com"
            className="text-accent hover:text-accent-hover"
          >art.ksoros@gmail.com</a>, <a href="tel:+79919797119" className="text-accent hover:text-accent-hover">{legalContacts.phone}</a>, Telegram {legalContacts.telegram}.
        </p>
        <p>
          Для печатной версии используйте статический файл{" "}
          <Link href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover">
            /privacy.html
          </Link>
          .
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">1. Термины и общие положения</h2>
        <p>
          1.1. «Оператор» — самозанятый Артемий Ксорос, оказывающий консультационные услуги под брендом JyotishGPT и управляющий сайтом
          <Link href="https://jyotishgpt.ru" className="text-accent hover:text-accent-hover"> https://jyotishgpt.ru</Link>.
        </p>
        <p>
          1.2. «Пользователь» — любое физическое лицо, посещающее сайт, взаимодействующее с Telegram-ботом <span className="whitespace-nowrap">@artemiy_ksoros_bot</span>
          или обращающееся к Артемию Ксорос за консультацией.
        </p>
        <p>1.3. «Персональные данные» — любая информация, относящаяся к определённому или определяемому физическому лицу.</p>
        <p>
          1.4. Настоящая Политика распространяется на сайт JyotishGPT.ru, связанные страницы, Telegram-бота и формы связи, включая интеграции с Google Analytics,
          Яндекс.Метрикой и API искусственного интеллекта (например, OpenAI API).
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">2. Категории обрабатываемых данных</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>ФИО или псевдоним, контактный email, номер телефона, Telegram-аккаунт.</li>
          <li>Информация, предоставляемая в заявках и сообщениях: дата рождения, формулировка запроса, цели консультации.</li>
          <li>
            Технические данные: IP-адрес, тип устройства и браузера, cookies, referrer, время посещения, статистика взаимодействия с контентом.
          </li>
          <li>Сведения об оплате услуг (статус платежа, сумма, идентификаторы транзакций) при работе с сервисами оплаты.</li>
          <li>Аудио-, текстовые и медиафайлы, добровольно предоставленные Пользователем для анализа.</li>
        </ul>
        <p className="text-neutral-500">
          Оператор не собирает специально биометрические данные, сведения о состоянии здоровья или иные категории, указанные в ст. 10 152-ФЗ. Такие данные могут
          быть предоставлены Пользователем добровольно в рамках консультации и используются только для целей оказания услуги.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">3. Цели и правовые основания обработки</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Заключение и исполнение договоров оказания консультационных услуг (ст. 6 ч. 1 п. 2 152-ФЗ).</li>
          <li>Подготовка персонализированных рекомендаций на основе данных, предоставленных Пользователем.</li>
          <li>Обработка запросов в Telegram-боте и на сайте, обратная связь и техническая поддержка.</li>
          <li>Ведение бухгалтерского учёта и соблюдение налогового законодательства (Налоговый кодекс РФ).</li>
          <li>Улучшение сервиса и аналитика аудитории с помощью Google Analytics, Яндекс.Метрики и других разрешённых инструментов (на основании согласия Пользователя).</li>
          <li>Рассылка уведомлений и материалов при наличии отдельного согласия Пользователя.</li>
        </ul>
        <p>
          Основанием обработки персональных данных является согласие Пользователя, данное при отправке формы, активации Telegram-бота, оплате услуги или подтверждении cookie-баннера.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">4. Используемые технологии и привлечение третьих лиц</h2>
        <p>
          Для оказания услуг Оператор использует внешние сервисы, которые могут получать доступ к персональным данным в объёме, необходимом для работы:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Telegram (LLC «Telegram Messenger»): обработка переписки, голосовых и медиафайлов в соответствии с политикой Telegram.</li>
          <li>Google LLC (Google Analytics, Google Workspace): аналитика поведения на сайте, хранение анкет и подготовка материалов.</li>
          <li>Яндекс ООО («Яндекс.Метрика»): сбор обезличенной статистики посещений.</li>
          <li>OpenAI OpCo, LLC и иные AI-провайдеры: обработка текстов запросов для генерации рекомендаций.</li>
          <li>Платёжные сервисы (например, YooKassa): обработка статусов платежей без хранения реквизитов карт на стороне Оператора.</li>
        </ul>
        <p>
          Каждому сервису передаются только необходимые данные. Передача осуществляется на основании договоров-оферт соответствующих сервисов и пользовательского согласия.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">5. Сроки хранения и меры защиты</h2>
        <p>
          Персональные данные хранятся столько, сколько необходимо для достижения целей обработки, но не более 5 лет с даты последнего взаимодействия, если иные сроки
          не предусмотрены законодательством. Документы, подтверждающие оказание услуг и платежи, хранятся до 5 лет в соответствии с налоговыми требованиями.
        </p>
        <p>
          Данные размещаются в защищённых облачных сервисах Google Workspace, Telegram и на хостинге Vercel/Next.js. Доступ к аккаунтам ограничен владельцем проекта.
          Используются двухфакторная аутентификация, регулярное обновление паролей и мониторинг активностей.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">6. Cookie и аналогичные технологии</h2>
        <p>
          Сайт применяет обязательные cookie для обеспечения работы и сохранения пользовательских настроек, а также аналитические cookie Google Analytics и Яндекс.Метрики
          для оценки эффективности контента. Cookie сохраняются на устройстве Пользователя и могут быть удалены через настройки браузера.
        </p>
        <p>
          Продолжая использовать сайт, Пользователь выражает согласие на использование cookie. Согласие можно отозвать, очистив cookie и отправив запрос Оператору.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">7. Права Пользователя</h2>
        <p>Пользователь имеет право:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Получать информацию об обработке своих персональных данных (ст. 14 152-ФЗ).</li>
          <li>Требовать уточнения, блокирования или уничтожения данных, если они являются неполными, устаревшими или незаконно обработанными.</li>
          <li>Отозвать согласие на обработку, направив запрос на email {legalContacts.email} или в Telegram {legalContacts.telegram}. Отзыв согласия может ограничить возможность получения консультаций.</li>
          <li>Обжаловать действия Оператора в Роскомнадзор или судебном порядке.</li>
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">8. Передача данных третьим лицам и трансграничная передача</h2>
        <p>
          Оператор не передаёт персональные данные третьим лицам, за исключением случаев, указанных в разделах выше, а также по требованию государственных органов в
          рамках законодательства РФ. Используемые сервисы (Google, Telegram, OpenAI) могут находиться за пределами РФ, что означает трансграничную передачу данных.
          Передавая данные, Пользователь даёт согласие на такую передачу.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">9. Особые условия</h2>
        <p>
          Сервис не предназначен для обработки персональных данных несовершеннолетних до 18 лет без участия законных представителей. При получении информации о том,
          что данные ребёнка были предоставлены без согласия, Оператор удалит их по запросу.
        </p>
        <p>
          Консультации не являются медицинской, психологической или юридической услугой. Оператор не несёт ответственности за решения, принятые Пользователем на основе рекомендаций.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">10. Обновление политики</h2>
        <p>
          Политика может быть обновлена при изменении законодательства или процессов обработки данных. Актуальная версия всегда опубликована на странице
          <Link href="/privacy" className="text-accent hover:text-accent-hover"> /privacy</Link>. При существенных изменениях Пользователям направляется уведомление по доступным контактам или через Telegram-каналы проекта.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">11. Контакты для обращений</h2>
        <p>Все запросы по персональным данным направляйте:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Email: <a href="mailto:art.ksoros@gmail.com" className="text-accent hover:text-accent-hover">art.ksoros@gmail.com</a></li>
          <li>Телефон: <a href="tel:+79919797119" className="text-accent hover:text-accent-hover">{legalContacts.phone}</a></li>
          <li>Telegram: <span className="whitespace-nowrap">{legalContacts.telegram}</span></li>
          <li>Почтовый адрес: Москва, Россия.</li>
        </ul>
      </section>
      </main>
      <LegalFooter />
    </>
  );
}
