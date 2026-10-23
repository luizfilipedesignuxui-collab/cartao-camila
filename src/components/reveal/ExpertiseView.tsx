import { motion } from "framer-motion";
import type { BusinessCardConfig } from "../../config/business-card.ts";
import { easeOut, usePrefersReducedMotion } from "../../lib/motion.ts";

export function ExpertiseView({ card }: { card: BusinessCardConfig }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className="mx-auto w-full max-w-md px-5"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.42, ease: easeOut }}
    >
      <p className="text-xs tracking-[0.16em] text-muted uppercase">Especialidades</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Como Camila atua</h2>
      {card.competencies.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {card.competencies.map((item) => (
            <li key={item} className="border-l-2 border-media pl-4 text-base leading-snug text-ink">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {card.principles.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-xs tracking-[0.16em] text-muted uppercase">Princípios</h3>
          <ul className="mt-3 space-y-2">
            {card.principles.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.div>
  );
}
