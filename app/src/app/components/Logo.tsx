// TradeNow logo, hosted in the Trade Now (company 78) Solid# asset library.
//   wordmark: "TradeNow" + arrow; for headers and other small sizes.
//   full:     adds "AUTOMOTIVE GROUP"; use where it can be at least ~40px tall.
const LOGO_HOST = "https://solid-tenant-assets.nyc3.digitaloceanspaces.com/company_78/uploads";
const LOGO_SRC = {
  wordmark: `${LOGO_HOST}/ast_a84fec6d/tradenow-logo-wordmark.png`,
  full: `${LOGO_HOST}/ast_25e72ee6/tradenow-logo-full.png`,
} as const;

export function Logo({
  className = "",
  height = 36,
  variant = "wordmark",
}: {
  className?: string;
  height?: number;
  variant?: keyof typeof LOGO_SRC;
}) {
  return (
    <img
      src={LOGO_SRC[variant]}
      alt="TradeNow Automotive Group"
      style={{ height }}
      className={`object-contain ${className}`}
    />
  );
}
