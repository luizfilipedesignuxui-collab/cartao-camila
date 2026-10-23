import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRef, type PointerEvent, type Ref } from "react";
import type { BusinessCardConfig } from "../config/business-card.ts";
import type { ActionGroup, ActionId } from "../lib/actions.ts";
import { easeOut, usePrefersReducedMotion } from "../lib/motion.ts";
import { ActionButton } from "./ActionButton.tsx";
import { AvatarMark } from "./Marks.tsx";
import { PracticePanel } from "./PracticePanel.tsx";
import { ProfileStats } from "./ProfileStats.tsx";

type OptionsSheetProps = {
  open: boolean;
  card: BusinessCardConfig;
  groups: readonly ActionGroup[];
  experienceOpen: boolean;
  onToggleExperience: () => void;
  onAction: (id: ActionId) => void;
  onClose: () => void;
  closeRef: Ref<HTMLButtonElement>;
};

export function OptionsSheet({
  open,
  card,
  groups,
  experienceOpen,
  onToggleExperience,
  onAction,
  onClose,
  closeRef,
}: OptionsSheetProps) {
  const reduced = usePrefersReducedMotion();
  const dragStart = useRef<number | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    const target = event.target;
    if (target instanceof Element && target.closest("button, a")) return;
    dragStart.current = event.clientY;
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (dragStart.current == null) return;
    const delta = event.clientY - dragStart.current;
    dragStart.current = null;
    if (delta > 72) onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          key="painel"
          id="painel-opcoes"
          aria-labelledby="painel-titulo"
          className="absolute inset-0 z-20 flex w-full min-w-0 flex-col overflow-hidden bg-bg"
          initial={reduced ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={reduced ? { opacity: 1 } : { y: "100%" }}
          transition={{ duration: reduced ? 0 : 0.42, ease: easeOut }}
        >
          <div
            className="shrink-0 touch-none px-5 pt-1"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              dragStart.current = null;
            }}
          >
            <button
              ref={closeRef}
              type="button"
              className="focus-ring grid size-11 place-items-center rounded-full text-ink"
              aria-label="Fechar opções do cartão"
              onClick={onClose}
            >
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>

            <div className="mt-1 flex items-center gap-3">
              <AvatarMark logoSrc={card.logoSrc} />
              <div className="min-w-0">
                <h2
                  id="painel-titulo"
                  className="truncate text-[1.35rem] leading-tight font-semibold tracking-[-0.03em] text-ink"
                >
                  {card.fullName}
                </h2>
                <p className="truncate text-sm text-muted">
                  {card.role} · {card.credential}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[0.95rem] leading-snug text-muted">{card.practiceLine}</p>
            <div className="mt-5">
              <ProfileStats card={card} />
            </div>
          </div>

          <motion.div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-4"
            initial={reduced ? false : "hidden"}
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduced ? 0 : 0.05,
                  delayChildren: reduced ? 0 : 0.04,
                },
              },
            }}
          >
            {groups.map((group) => (
              <motion.section
                key={group.id}
                aria-labelledby={`grupo-${group.id}`}
                className="mt-5 first:mt-0"
                variants={{
                  hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: reduced ? 0 : 0.28, ease: easeOut },
                  },
                }}
              >
                <h3 id={`grupo-${group.id}`} className="mb-2.5 text-xs font-medium text-muted">
                  {group.title}
                </h3>
                <ul className="grid grid-cols-2 gap-2.5">
                  {group.actions.map((action) => (
                    <li
                      key={action.id}
                      className={
                        action.id === "experience" && experienceOpen ? "col-span-2" : "min-w-0"
                      }
                    >
                      {action.id === "experience" && experienceOpen ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          <ActionButton
                            action={action}
                            expanded={experienceOpen}
                            onActivate={onToggleExperience}
                          />
                        </div>
                      ) : (
                        <ActionButton
                          action={action}
                          expanded={experienceOpen}
                          onActivate={() =>
                            action.id === "experience" ? onToggleExperience() : onAction(action.id)
                          }
                        />
                      )}
                      {action.id === "experience" && experienceOpen ? (
                        <div className="mt-2.5">
                          <PracticePanel card={card} />
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ))}

            <div className="mt-4 flex gap-3 rounded-md bg-surface p-3.5 ring-1 ring-line">
              <AvatarMark logoSrc={card.logoSrc} size="sm" />
              <p className="text-sm leading-snug text-ink">{card.summary}</p>
            </div>
          </motion.div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
