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
    variant === "secondary" &&
      "border border-[#c55a3a]/45 bg-[#e97854] text-white shadow-[0_14px_38px_rgba(176,77,45,0.16)] backdrop-blur-sm hover:bg-[#d96843] hover:shadow-[0_18px_48px_rgba(161,57,28,0.22)]",
    variant === "glow" &&
      "relative overflow-hidden border border-[#c55a3a]/40 bg-gradient-to-r from-[#f7b79b] via-[#dd6d4f] to-[#c24526] text-[#fff9f7] shadow-[0_18px_48px_rgba(176,77,45,0.28)] backdrop-blur-sm transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_68px_rgba(161,57,28,0.32)] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top,rgba(255,190,164,0.32),transparent_58%)] before:opacity-80 before:transition-opacity before:duration-300 hover:before:opacity-95",
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
