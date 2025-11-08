import type { Metadata } from "next";

import Image from "next/image";

import { CTAButton } from "./components/CTAButton";
import { siteConfig } from "../content/site-config";

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
  alternates: {
    canonical: "/"
  },
  keywords: [
    "JyotishGPT",
    "Артемий Ксорос",
    "ведическая нумерология",
    "AI-нумерология",
    "ведический искусственный интеллект",
    "самоанализ",
    "ведические знания"
  ],
  openGraph: {
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.meta.title,
    description: siteConfig.meta.description
  }
};

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

export default function HomePage() {
  const { hero, features, chatPreview, flow, closingNote, telegramLink } = siteConfig;
  const defaultTelegramMessage = "Привет! А какие ресурсы у вас есть?";
  const heroTelegramLink = createTelegramLinkWithText(telegramLink, defaultTelegramMessage);
  const heroSubheadline = hero.subheadline.trim();
  const flowTitle = flow.title.trim();
  const flowDescription = flow.description.trim();
  const flowSteps = (flow.steps ?? []).map((step) => step.trim()).filter(Boolean);
  const hasFlowContent = Boolean(flowTitle || flowDescription || flowSteps.length > 0);
  const snippetText =
    "JyotishGPT — это авторский проект Артемия Ксороса, в котором искусственный интеллект соединяется с ведическими системами самоанализа. Помогает человеку осознать свой путь, рассчитать периоды и лучше понять свою природу.";
  const aboutStatements = [
    {
      title: "Artemiy Ksoros",
      description:
        "Artemiy Ksoros — исследователь ведической астрологии и цифровых технологий. Создатель JyotishGPT — проекта, соединяющего древние знания и искусственный интеллект."
    },
    {
      title: "О проекте JyotishGPT",
      description:
        "JyotishGPT — AI-помощник для самоанализа и осознанного развития. Система совмещает нумерологию, ведическую астрологию и аналитические модели, чтобы поддерживать человека в реальных жизненных решениях."
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fdf6e8] via-[#f8e6c9] to-[#f3d9aa] text-neutral-900">
      {/* Фон с цифровой глубиной */}
      <div className="pointer-events-none absolute inset-0">
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(213,170,84,0.32), transparent 60%), radial-gradient(circle at 78% 18%, rgba(207,153,63,0.24), transparent 64%), radial-gradient(circle at 48% 80%, rgba(226,187,110,0.2), transparent 66%)"
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(215,174,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(215,174,92,0.2) 1px, transparent 1px)",
            backgroundSize: "80px 80px"
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 78%, rgba(210,160,70,0.28) 0, rgba(210,160,70,0) 58%), radial-gradient(circle at 88% 82%, rgba(200,144,55,0.2) 0, rgba(200,144,55,0) 60%)"
          }}
        />
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,165,78,0.28),transparent_72%)] blur-3xl animate-float" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,149,58,0.3),transparent_78%)] blur-3xl animate-soft-pulse" />
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(193,138,46,0.34),transparent_74%)] blur-[120px] animate-soft-pulse" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: "radial-gradient(rgba(225,190,112,0.22) 1px, transparent 1px)",
            backgroundSize: "120px 120px"
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-between gap-6 px-6 pb-8 pt-0 sm:gap-16 sm:px-10 sm:py-16 lg:px-12">
        <header className="relative flex min-h-screen flex-col justify-center overflow-visible pb-12 pt-24 sm:min-h-[660px] sm:justify-center sm:pb-24 sm:pt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-6 -z-10 h-[520px] w-[min(95vw,600px)] -translate-x-1/2 rounded-[55%] bg-[radial-gradient(circle_at_top,rgba(204,152,59,0.3),transparent_76%)] blur-3xl"
          />

          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-10 flex w-screen -translate-x-1/2 -translate-y-12 justify-center md:hidden"
            style={{ height: "min(100vh, calc(100vw * 1.5))" }}
          >
            <Image
              src="/photo.png"
              alt="Портрет Артемия Ксороса"
              priority
              width={960}
              height={1440}
              className="h-full w-full origin-top transform-gpu object-contain object-top"
            />
          </div>

          <div className="relative z-10 flex w-full flex-col gap-5 sm:gap-10 md:grid md:grid-cols-[1.02fr_1fr] md:items-center">
            <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
              <div className="pointer-events-none absolute inset-x-[-1.5rem] bottom-[-4rem] top-[-5rem] -z-10 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(209,158,71,0.34),transparent_70%)] backdrop-blur-[2px] md:hidden" aria-hidden />
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c59a58]/30 bg-[#fff4df]/80 px-4 py-1 text-xs uppercase tracking-[0.32em] text-neutral-600">
                {hero.eyebrow}
              </span>

              <div className="mt-3 max-w-xl drop-shadow-[0_12px_32px_rgba(125,84,25,0.24)] sm:mt-6">
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-[2.85rem] lg:text-[3.15rem] lg:leading-[1.08]">
                  <span className="relative inline-flex">
                    <span className="animate-hero-shimmer bg-[linear-gradient(120deg,#3c260c,#9c6c2f,#f6e0ad,#9c6c2f,#3c260c)] bg-[length:220%_220%] bg-clip-text text-transparent drop-shadow-[0_8px_22px_rgba(110,75,31,0.35)]">
                      {hero.headline}
                    </span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-[radial-gradient(circle,rgba(148,102,34,0.45),transparent_68%)] blur-[22px]"
                    />
                  </span>
                </h1>
                {heroSubheadline && (
                  <p className="mt-5 text-lg text-neutral-600 md:text-xl">
                    {heroSubheadline}
                  </p>
                )}
              </div>

              <div className="mt-5 flex w-full flex-col items-center gap-4 text-center sm:mt-10 sm:flex-row sm:items-center sm:justify-start sm:text-left">
                <CTAButton
                  href={heroTelegramLink}
                  variant="glow"
                  className="px-8 py-3.5 text-lg shadow-[0_22px_70px_rgba(125,84,25,0.22)]"
                >
                  {hero.ctaLabel}
                </CTAButton>

                {hero.note && (
                  <p className="max-w-md text-sm text-neutral-500 sm:text-left">{hero.note}</p>
                )}
              </div>
            </div>

            <div className="relative hidden justify-center md:flex">
              <div className="relative w-[min(88vw,520px)] max-w-[520px]">
                <Image
                  src="/photo.png"
                  alt="Портрет Артемия Ксороса"
                  priority
                  width={960}
                  height={1440}
                  sizes="(min-width: 1280px) 520px, (min-width: 768px) 460px, (min-width: 640px) 420px, 88vw"
                  className="w-full origin-top scale-[0.97] transform-gpu rounded-[36px] object-cover object-top"
                />
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-6 sm:space-y-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl border border-[#cda15e]/30 bg-[#fff4de]/80 p-5 shadow-[0_18px_46px_rgba(125,84,25,0.14)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#b78945]/40 hover:bg-[#fde7c9]"
                >
                  <div className="absolute inset-0 -z-10 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden>
                    <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(204,152,59,0.34),transparent_70%)] animate-soft-pulse" />
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl md:text-4xl">{feature.icon}</span>
                    <h2 className="text-lg font-bold tracking-[0.01em] text-neutral-900 md:text-[1.35rem]">
                      {feature.title}
                    </h2>
                  </div>
                  <p className="text-sm font-medium leading-relaxed tracking-[0.015em] text-neutral-600 md:text-base">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
            <aside className="relative overflow-hidden rounded-3xl border border-[#cda15e]/30 bg-[#fff3dc]/90 p-6 shadow-[0_24px_64px_rgba(125,84,25,0.14)] backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
                <div className="absolute -top-24 right-0 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(205,151,60,0.28),transparent_68%)] blur-3xl" />
                <div className="absolute bottom-[-4rem] left-[-3rem] h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(196,140,44,0.32),transparent_72%)] blur-3xl" />
              </div>
              <div className="relative z-10 flex h-full flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-neutral-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  {chatPreview.title}
                </div>
                <div className="flex flex-1 flex-col gap-3 text-sm">
                  {chatPreview.messages.map((message, index) => (
                    <div
                      key={`${message.sender}-${index}`}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[17rem] rounded-2xl border px-4 py-3 shadow-[0_14px_38px_rgba(125,84,25,0.12)] backdrop-blur-sm ${
                          message.sender === "user"
                            ? "border-accent/40 bg-accent text-white"
                            : "border-[#cda15e]/30 bg-[#fff3dc] text-neutral-800"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center md:justify-start">
                  <CTAButton
                    href="/questions"
                    variant="secondary"
                    newTab={false}
                    analyticsEvent="click_questions"
                    className="px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] sm:text-base"
                  >
                    Что можно спросить?
                  </CTAButton>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="space-y-4 rounded-[32px] border border-[#cda15e]/30 bg-[#fff3dc]/80 px-6 py-8 shadow-[0_24px_64px_rgba(125,84,25,0.14)] backdrop-blur-sm sm:px-10">
          <h2 className="text-2xl font-semibold text-neutral-900 md:text-[2rem]">Официальное описание JyotishGPT</h2>
          <p className="text-base leading-relaxed text-neutral-700 md:text-lg">{snippetText}</p>
        </section>

        <section className="space-y-6 rounded-[32px] border border-[#cda15e]/30 bg-[#fff7e8]/80 px-6 py-8 shadow-[0_24px_64px_rgba(125,84,25,0.12)] backdrop-blur-sm sm:px-10">
          <h2 className="text-2xl font-semibold text-neutral-900 md:text-[2rem]">О JyotishGPT и создателе</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {aboutStatements.map((item) => (
              <article
                key={item.title}
                className="space-y-3 rounded-3xl border border-[#cda15e]/25 bg-white/70 p-6 shadow-[0_18px_48px_rgba(125,84,25,0.1)]"
              >
                <h3 className="text-xl font-semibold text-neutral-900">{item.title}</h3>
                <p className="text-base leading-relaxed text-neutral-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {hasFlowContent && (
          <section className="relative overflow-hidden rounded-[32px] border border-[#cda15e]/30 bg-gradient-to-br from-[#fff6e7] via-[#f6e3c4] to-[#efd49e] px-6 py-10 shadow-[0_28px_78px_rgba(125,84,25,0.16)] backdrop-blur-sm sm:px-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 right-6 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,rgba(206,150,57,0.3),transparent_60%)] opacity-70 blur-3xl animate-soft-pulse" />
              <div className="absolute bottom-[-3rem] left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(198,143,48,0.32),transparent_68%)] opacity-65 blur-3xl animate-float" />
              <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(209,160,71,0.24),transparent_60%)] opacity-45" />
            </div>

            <div className="relative z-10 space-y-6">
              {flowTitle && (
                <h2 className="text-3xl font-semibold leading-snug text-neutral-900 md:text-[2.25rem]">
                  {flowTitle}
                </h2>
              )}
              {flowDescription && (
                <p className="max-w-2xl text-base text-neutral-600 md:text-lg">
                  {flowDescription}
                </p>
              )}
              {flowSteps.length > 0 && (
                <ol className="space-y-4">
                  {flowSteps.map((step, index) => (
                    <li key={`${step}-${index}`} className="flex items-start gap-4">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent text-base font-medium text-white">
                        {index + 1}
                      </span>
                      <p className="text-base text-neutral-600 md:text-lg">{step}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        )}

        {closingNote && (
          <footer className="border-t border-[#cda15e]/30 pt-6 text-center text-sm text-neutral-500">
            {closingNote}
          </footer>
        )}
      </div>
    </main>
  );
}
