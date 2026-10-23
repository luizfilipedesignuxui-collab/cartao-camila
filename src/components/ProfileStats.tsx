import type { BusinessCardConfig } from "../config/business-card.ts";

type ProfileStatsProps = {
  card: BusinessCardConfig;
};

export function ProfileStats({ card }: ProfileStatsProps) {
  const items = [
    { value: String(card.competencies.length), label: "Áreas" },
    { value: String(card.principles.length), label: "Princípios" },
    { value: "SP", label: "São Paulo" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-[1.65rem] leading-none font-semibold tracking-[-0.03em] text-ink">
            {item.value}
          </p>
          <p className="mt-1.5 text-xs text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
