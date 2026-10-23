import { motion } from "framer-motion";
import type { BusinessCardConfig } from "../../config/business-card.ts";
import { easeOut, usePrefersReducedMotion } from "../../lib/motion.ts";

export function EvidenceView({ card }: { card: BusinessCardConfig }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className="mx-auto w-full max-w-md px-5"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.42, ease: easeOut }}
    >
      <p className="text-xs tracking-[0.16em] text-muted uppercase">Percurso</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Evidências profissionais</h2>

      {card.experiences.length > 0 ? (
        <ol className="mt-6 space-y-5">
          {card.experiences.map((item) => (
            <li key={`${item.organization}-${item.role}`} className="border-l-2 border-media pl-4">
              <p className="text-base font-semibold text-ink">{item.role}</p>
              <p className="mt-1 text-sm text-muted">
                {item.organization}, {item.period}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{item.detail}</p>
            </li>
          ))}
        </ol>
      ) : null}

      {card.formation.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-xs tracking-[0.16em] text-muted uppercase">Formação</h3>
          <ul className="mt-3 space-y-3">
            {card.formation.map((item) => (
              <li key={`${item.title}-${item.period}`}>
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="text-sm text-muted">
                  {item.place}, {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {card.credential ? (
        <p className="mt-8 text-xs tracking-wide text-muted uppercase">{card.credential}</p>
      ) : null}
    </motion.div>
  );
}
