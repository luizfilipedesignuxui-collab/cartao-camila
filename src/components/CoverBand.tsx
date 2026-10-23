type CoverBandProps = {
  src: string;
  name: string;
  tone?: "media" | "ink";
};

export function CoverBand({ src, name, tone = "media" }: CoverBandProps) {
  const ground = tone === "ink" ? "bg-ink" : "bg-media";

  if (!src) {
    return <div className={`h-28 w-full ${ground}`} aria-hidden="true" />;
  }

  return (
    <div className={`w-full ${ground}`}>
      <img
        src={src}
        alt={`Capa do LinkedIn de ${name}`}
        width={800}
        height={199}
        className="block h-auto w-full object-contain object-center"
      />
    </div>
  );
}
