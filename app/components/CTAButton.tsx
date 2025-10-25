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
    variant === "primary" && "bg-accent text-white hover:bg-accent-hover",
    variant === "secondary" && "border border-neutral-900/10 bg-white text-neutral-900 hover:bg-neutral-100",
    variant === "glow" &&
      "relative overflow-hidden border border-neutral-900/10 bg-gradient-to-r from-[#fefefe] via-[#f8f8f8] to-[#ededed] text-neutral-900 shadow-[0_18px_48px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(0,0,0,0.16)] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_60%)] before:opacity-70 before:transition-opacity before:duration-300 hover:before:opacity-90",
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
      <span aria-hidden="true">→</span>
    </Link>
  );
}
