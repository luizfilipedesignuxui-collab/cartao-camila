import type { BusinessCardConfig } from "../config/business-card.ts";

type PracticePanelProps = {
  card: BusinessCardConfig;
};

function ItemList({ title, items }: { title: string; items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4 first:mt-0">
      <h4 className="text-xs font-medium text-muted">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-snug text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PracticePanel({ card }: PracticePanelProps) {
  return (
    <div id="atuacao-camila" className="rounded-md bg-surface px-4 py-4 ring-1 ring-line">
      {card.experiences.length > 0 ? (
        <div>
          <h4 className="text-xs font-medium text-muted">Experiências</h4>
          <ul className="mt-2 space-y-3">
            {card.experiences.map((item) => (
              <li key={`${item.role}-${item.organization}-${item.period}`}>
                <p className="text-sm font-medium text-ink">{item.role}</p>
                <p className="text-sm text-muted">
                  {item.organization}
                  {item.period ? ` · ${item.period}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <ItemList title="Competências" items={card.competencies} />
      <ItemList title="Princípios" items={card.principles} />
    </div>
  );
}
