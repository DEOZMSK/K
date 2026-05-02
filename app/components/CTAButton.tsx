import Link from "next/link";

export interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  analyticsEvent?: string;
  variant?: "primary" | "secondary" | "glow";
  newTab?: boolean;
}

export function CTAButton({
  href,
  children,
  className,
  analyticsEvent = "click_telegram",
  variant = "primary",
  newTab = true
}: CTAButtonProps) {
  const classes = [
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition focus:outline-none focus-visible:shadow-focus",
    variant === "primary" && "border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/15",
    variant === "secondary" &&
      "border border-white/15 bg-black/40 text-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md hover:bg-black/55",
    variant === "glow" &&
      "relative overflow-hidden border border-white/20 bg-gradient-to-r from-[#0f1115] via-[#171b22] to-[#20242d] text-white shadow-[0_16px_42px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:brightness-110",
    "no-underline",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={href}
      target={newTab ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={classes}
      data-analytics-event={analyticsEvent}
    >
      {children}
      <span aria-hidden="true">&rsaquo;</span>
    </Link>
  );
}
