import type { Metadata } from "next";
import Link from "next/link";

import { LegalFooter } from "../components/LegalFooter";

export const metadata: Metadata = {
  title: "Дисклеймер о Telegram — JyotishGPT",
  description:
    "Информация о переходе на стороннюю платформу Telegram, ответственности сервиса JyotishGPT и правилах обработки данных Telegram.",
  alternates: {
    canonical: "/telegram-disclaimer"
  }
};

const requisites = {
  email: "art.ksoros@gmail.com",
  phone: "+7 (991) 979-71-19",
  telegram: "@BAPHbl"
};

export default function TelegramDisclaimerPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-7 text-neutral-700 sm:px-6">
      <header className="space-y-3 text-neutral-900">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">Юридические документы</p>
        <h1 className="text-3xl font-semibold">Дисклеймер о Telegram</h1>
        <p className="text-base text-neutral-600">
          После нажатия на кнопки связи на сайте JyotishGPT.ru вы переходите в сторонний сервис Telegram. Ниже указаны важные условия, которые необходимо учитывать.
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">1. Telegram — отдельная платформа</h2>
        <p>
          Telegram (LLC «Telegram Messenger» и связанные лица) является независимой площадкой, имеющей собственные правила использования и политику конфиденциальности, опубликованную на сайте <a
            href="https://telegram.org/privacy"
            className="text-accent hover:text-accent-hover"
            rel="noopener noreferrer"
            target="_blank"
          >telegram.org/privacy</a>.
        </p>
        <p>
          Управление Telegram, хранение сообщений, использование голосовых и видеозвонков, а также обработка файлов осуществляется исключительно Telegram.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">2. Ответственность JyotishGPT</h2>
        <p>
          JyotishGPT и самозанятый консультант Артемий Ксорос не управляют серверами Telegram, не определяют политику безопасности и не могут гарантировать сохранность данных, передаваемых через Telegram.
        </p>
        <p>
          Ответственность за обработку данных в Telegram несёт Telegram. JyotishGPT использует полученную переписку только для оказания консультационных услуг и соблюдает требования 152-ФЗ. Дополнительные детали представлены в <Link
            href="/privacy"
            className="text-accent hover:text-accent-hover"
          >Политике конфиденциальности</Link> и <Link href="/user-agreement" className="text-accent hover:text-accent-hover">Пользовательском соглашении</Link>.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">3. Рекомендации пользователям</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Перед началом общения проверьте актуальность настроек приватности вашего Telegram-аккаунта.</li>
          <li>Не передавайте в Telegram данные, которые не хотите раскрывать сервису Telegram или третьим лицам.</li>
          <li>При необходимости защищённого канала связи свяжитесь с Оператором по email {" "}
            <a href="mailto:art.ksoros@gmail.com" className="text-accent hover:text-accent-hover">{requisites.email}</a> или телефону {" "}
            <a href="tel:+79919797119" className="text-accent hover:text-accent-hover">{requisites.phone}</a> для согласования альтернативных способов коммуникации.
          </li>
          <li>При обнаружении сбоев, утечки данных или подозрительной активности сообщите Оператору и в поддержку Telegram.</li>
        </ul>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">4. Контакты для вопросов</h2>
        <p>По вопросам безопасности и обработки данных обращайтесь:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Email: <a href="mailto:art.ksoros@gmail.com" className="text-accent hover:text-accent-hover">{requisites.email}</a></li>
          <li>Телефон: <a href="tel:+79919797119" className="text-accent hover:text-accent-hover">{requisites.phone}</a></li>
          <li>Telegram: <span className="whitespace-nowrap">{requisites.telegram}</span></li>
        </ul>
      </section>
      </main>
      <LegalFooter />
    </>
  );
}
