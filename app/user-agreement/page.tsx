import type { Metadata } from "next";
import Link from "next/link";

import { LegalFooter } from "../components/LegalFooter";

export const metadata: Metadata = {
  title: "Пользовательское соглашение JyotishGPT",
  description:
    "Условия использования сайта JyotishGPT, Telegram-бота и согласие на обработку персональных данных от самозанятого консультанта Артемия Ксорос.",
  alternates: {
    canonical: "/user-agreement"
  },
  openGraph: {
    title: "Пользовательское соглашение JyotishGPT",
    description:
      "Документ определяет правила пользования сервисом JyotishGPT, ответственность сторон и порядок обработки персональных данных.",
    url: "/user-agreement"
  },
  twitter: {
    card: "summary_large_image",
    title: "Пользовательское соглашение JyotishGPT",
    description:
      "Документ определяет правила пользования сервисом JyotishGPT, ответственность сторон и порядок обработки персональных данных."
  }
};

const requisites = {
  inn: "500119421000",
  email: "art.ksoros@gmail.com",
  phone: "+7 (991) 979-71-19",
  telegram: "@BAPHbl"
};

export default function UserAgreementPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-7 text-neutral-700 sm:px-6">
      <header className="space-y-3 text-neutral-900">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">Юридические документы</p>
        <h1 className="text-3xl font-semibold">Пользовательское соглашение и согласие на обработку данных</h1>
        <p className="text-sm text-neutral-500">
          Оферта самозанятого консультанта Артемия Ксорос (ИНН {requisites.inn}), действующего в статусе плательщика налога на профессиональный доход, расположенного в Москве, Россия.
        </p>
        <p className="text-sm text-neutral-600">
          Документ регулирует использование сайта <Link href="https://jyotishgpt.ru" className="text-accent hover:text-accent-hover">https://jyotishgpt.ru</Link>, Telegram-бота <span className="whitespace-nowrap">@artemiy_ksoros_bot</span>, каналов
          @JyotishGPT, @GPT_IVI и прямых контактов с Артемием Ксорос под брендами «JyotishGPT», «mr.Kcopoc», «Артемий Ксорос» и «@BAPHbl».
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">1. Общие положения</h2>
        <p>
          1.1. Настоящее соглашение (далее — «Соглашение») является публичной офертой в соответствии со ст. 437 ГК РФ. Присоединяясь к Соглашению, Пользователь подтверждает, что внимательно ознакомился с ним и принимает все условия без исключений.
        </p>
        <p>
          1.2. Оператором сервиса является самозанятый Артемий Ксорос. Сервис предоставляет консультационные услуги с использованием авторской системы искусственного интеллекта JyotishGPT.
        </p>
        <p>
          1.3. Оператор вправе вносить изменения в Соглашение. Актуальная версия всегда доступна на странице <Link href="/user-agreement" className="text-accent hover:text-accent-hover">/user-agreement</Link>.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">2. Предмет соглашения</h2>
        <p>
          2.1. Оператор оказывает Пользователю консультационные услуги, включая анализ даты рождения, жизненных периодов, подготовку рекомендаций и сопровождение в цифровом формате (сайт, Telegram, email).
        </p>
        <p>
          2.2. Результатом консультации являются текстовые, голосовые или визуальные материалы. Они носят рекомендательный характер и не являются медицинской, психологической, юридической или финансовой консультацией.
        </p>
        <p>
          2.3. Стоимость и формат услуг согласовываются индивидуально через Telegram или email до начала работы. Оплата может производиться через Telegram-бота, прямые переводы или платёжные сервисы (например, YooKassa).
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">3. Регистрация и взаимодействие</h2>
        <p>
          3.1. Для получения консультации Пользователь оставляет заявку на сайте, в Telegram-боте или пишет напрямую Оператору. Указание недостоверной информации может привести к отказу в оказании услуги.
        </p>
        <p>
          3.2. Пользователь обязуется использовать сервис только для личных целей и не передавать доступ третьим лицам без согласия Оператора.
        </p>
        <p>
          3.3. При обращении через Telegram Пользователь подтверждает, что ознакомился с политикой конфиденциальности Telegram и согласен с ней. Оператор не контролирует обработку данных в Telegram.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">4. Согласие на обработку персональных данных</h2>
        <p>
          4.1. Принимая Соглашение, Пользователь свободно, своей волей и в своём интересе даёт согласие на обработку персональных данных Оператором в соответствии с Федеральным законом №152-ФЗ «О персональных данных».
        </p>
        <p>
          4.2. Обрабатываемые данные включают имя, контактные сведения, дату рождения, содержимое запросов, файлы, платежную информацию (в пределах, необходимых для подтверждения оплаты), а также данные, автоматически собираемые с помощью cookie и аналитических сервисов.
        </p>
        <p>
          4.3. Цели обработки: заключение и исполнение договора, предоставление консультаций, ведение бухгалтерского учёта, аналитика качества сервиса, рассылка информационных сообщений по запросу Пользователя.
        </p>
        <p>
          4.4. Согласие действует до его отзыва. Пользователь может отозвать согласие, направив уведомление на email <a href="mailto:art.ksoros@gmail.com" className="text-accent hover:text-accent-hover">{requisites.email}</a> или в Telegram {requisites.telegram}. Отзыв согласия не влияет на законность обработки до момента отзыва, но может повлечь прекращение обслуживания.
        </p>
        <p>
          4.5. Подробности об обработке данных приведены в <Link href="/privacy" className="text-accent hover:text-accent-hover">Политике конфиденциальности</Link>.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">5. Права и обязанности сторон</h2>
        <p>
          5.1. Пользователь обязуется предоставлять достоверную информацию, уважительно взаимодействовать с Оператором и не публиковать полученные материалы без согласования.
        </p>
        <p>
          5.2. Пользователь вправе получать информацию об обработке своих данных, запрашивать корректировку и удаление, использовать материалы консультации для личных целей.
        </p>
        <p>
          5.3. Оператор обязуется соблюдать конфиденциальность, использовать данные только для обозначенных целей, своевременно уведомлять о существенных изменениях в услугах и документах.
        </p>
        <p>
          5.4. Оператор вправе приостановить или прекратить предоставление услуг при нарушении Пользователем условий Соглашения, несоблюдении норм этики, просрочке оплаты или при обнаружении признаков злоупотребления.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">6. Оплата и возвраты</h2>
        <p>
          6.1. Услуги оказываются после полной предоплаты или по иной схеме, согласованной сторонами. Факт оплаты подтверждает согласие с условиями Соглашения.
        </p>
        <p>
          6.2. Возврат средств осуществляется по письменному запросу Пользователя, направленному в течение 14 календарных дней с момента оплаты, если услуга ещё не оказана полностью. Расходы платёжных систем удерживаются из суммы возврата.
        </p>
        <p>
          6.3. При досрочном прекращении консультации по инициативе Пользователя возврат осуществляется пропорционально объёму невыполненных работ.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">7. Ответственность и ограничения</h2>
        <p>
          7.1. Оператор не несёт ответственности за невозможность оказания услуг, вызванную действиями третьих лиц, техническими сбоями Telegram, хостинга или платёжных систем.
        </p>
        <p>
          7.2. Пользователь самостоятельно принимает решения, основанные на рекомендациях JyotishGPT. Оператор не гарантирует получение конкретного результата и не отвечает за упущенную выгоду.
        </p>
        <p>
          7.3. В случае нарушения интеллектуальных прав на материалы консультации Пользователь обязан возместить Оператору причинённые убытки.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">8. Заключительные положения</h2>
        <p>
          8.1. К отношениям сторон применяется законодательство Российской Федерации. Споры решаются путём переговоров, а при недостижении соглашения — в судебном порядке по месту регистрации Оператора.
        </p>
        <p>
          8.2. Электронная переписка, в том числе в Telegram, признаётся равнозначной письменным доказательствам.
        </p>
        <p>
          8.3. Используя сайт, Telegram-бот или контактируя с Оператором, Пользователь подтверждает, что ознакомился с настоящим Соглашением, согласен с ним и с <Link href="/privacy" className="text-accent hover:text-accent-hover">Политикой конфиденциальности</Link>.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-outline/60 bg-white/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-900">9. Контакты Оператора</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Email: <a href="mailto:art.ksoros@gmail.com" className="text-accent hover:text-accent-hover">{requisites.email}</a></li>
          <li>Телефон: <a href="tel:+79919797119" className="text-accent hover:text-accent-hover">{requisites.phone}</a></li>
          <li>Telegram: <span className="whitespace-nowrap">{requisites.telegram}</span></li>
          <li>Адрес: Москва, Россия.</li>
        </ul>
      </section>
      </main>
      <LegalFooter />
    </>
  );
}
