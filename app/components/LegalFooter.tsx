import Link from "next/link";

const legalLinks = [
  { href: "/privacy", label: "Политика конфиденциальности" },
  { href: "/user-agreement", label: "Пользовательское соглашение" },
  { href: "/telegram-disclaimer", label: "Дисклеймер о Telegram" }
];

export function LegalFooter({ className = "" }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`border-t border-white/40 bg-white/70 backdrop-blur-sm text-neutral-500 ${className}`.trim()}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7 sm:text-sm">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-medium text-neutral-600">
            Артемий Ксорос · самозанятый консультант (ИНН 500119421000)
          </div>
          <div className="text-neutral-500">
            Москва, Россия · <a href="mailto:art.ksoros@gmail.com" className="underline decoration-dotted underline-offset-2">art.ksoros@gmail.com</a> · <a href="tel:+79919797119" className="underline decoration-dotted underline-offset-2">+7&nbsp;(991)&nbsp;979-71-19</a>
          </div>
          <div className="text-neutral-400">© {year} JyotishGPT · Артемий Ксорос</div>
        </div>
        <nav className="flex flex-wrap justify-center gap-3 text-center sm:justify-end">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-500 transition hover:text-neutral-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
