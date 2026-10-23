type BrandLogoProps = {
  src: string;
  onDark?: boolean;
  size?: "sm" | "md" | "hero";
  className?: string;
};

const sizes = {
  sm: "h-8 w-auto",
  md: "h-12 w-auto sm:h-14",
  hero: "mx-auto h-auto w-full max-w-[16rem] object-center sm:max-w-[20rem] lg:mx-0 lg:max-w-[24rem] lg:object-left",
} as const;

export function BrandLogo({ src, onDark = false, size = "md", className = "" }: BrandLogoProps) {
  if (!src) return null;

  const file = onDark ? src : src.replace(/\.png$/i, "-ink.png");

  return (
    <img
      src={file}
      alt=""
      width={3072}
      height={1833}
      decoding="async"
      className={`${sizes[size]} object-contain ${size === "hero" ? "" : "object-left"} ${className}`}
    />
  );
}
