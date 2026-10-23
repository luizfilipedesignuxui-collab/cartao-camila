import type { ReactNode } from "react";
import type { BusinessCardConfig } from "../config/business-card.ts";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md bg-surface-raised px-5 py-5 ring-1 ring-line" aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Journey({ card }: { card: BusinessCardConfig }) {
  return (
    <div className="flex flex-col gap-3">
      <Section id="sobre-camila" title="Sobre">
        <p className="mt-2 text-base leading-relaxed text-ink">{card.practiceLine}</p>
        <p className="mt-3 text-base leading-relaxed text-muted">{card.summary}</p>
        {card.competencies.length > 0 ? (
          <ul className="mt-4 space-y-1.5">
            {card.competencies.map((item) => (
              <li key={item} className="text-sm leading-snug text-ink">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section id="experiencia-camila" title="Experiência">
        <ol className="mt-4 space-y-4">
          {card.experiences.map((item) => (
            <li key={`${item.organization}-${item.role}`} className="border-l-2 border-media pl-4">
              <p className="text-base font-semibold text-ink">{item.role}</p>
              <p className="text-sm text-muted">
                {item.organization} · {item.period}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{item.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="formacao-camila" title="Formação">
        <ul className="mt-4 space-y-3">
          {card.formation.map((item) => (
            <li key={`${item.title}-${item.period}`}>
              <p className="text-base font-medium text-ink">{item.title}</p>
              <p className="text-sm leading-snug text-muted">
                {item.place} · {item.period}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
