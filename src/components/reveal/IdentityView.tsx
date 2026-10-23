import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import type { BusinessCardConfig } from "../../config/business-card.ts";
import { easeOut, usePrefersReducedMotion } from "../../lib/motion.ts";
import { PhotoSlot } from "../PhotoSlot.tsx";

const SWIPE_PX = 48;
const SLIDE_MS = 4800;

type FactSlide = {
  label: string;
  title: string;
  detail?: string;
};

function factSlides(card: BusinessCardConfig): FactSlide[] {
  const slides: FactSlide[] = [];
  if (card.specialty) {
    slides.push({
      label: "Foco",
      title: card.specialty,
      detail: card.practiceLine,
    });
  }
  if (card.summary) {
    slides.push({ label: "Como trabalha", title: card.summary });
  }
  const job = card.experiences[0];
  if (job) {
    slides.push({
      label: job.organization,
      title: job.role,
      detail: job.detail,
    });
  }
  if (card.credential) {
    slides.push({
      label: "Registro",
      title: card.credential,
      detail: card.location,
    });
  }
  return slides;
}

function chipsFromSpecialty(specialty: string) {
  return specialty
    .split(/,| e /)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
}

export function IdentityView({ card }: { card: BusinessCardConfig }) {
  const reduced = usePrefersReducedMotion();
  const slides = useMemo(() => factSlides(card), [card]);
  const chips = useMemo(() => chipsFromSpecialty(card.specialty), [card.specialty]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = slides[index];

  useEffect(() => {
    if (reduced || paused || slides.length < 2) return;
    const timeout = window.setTimeout(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(timeout);
  }, [index, paused, reduced, slides.length]);

  function go(delta: number) {
    setIndex((value) => (value + delta + slides.length) % slides.length);
  }

  function onCarouselKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden text-cream lg:flex-none">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-1 flex-col overflow-y-auto px-5 pt-5 pb-2 lg:h-auto lg:flex-none lg:overflow-visible lg:pt-4">
        <div className="self-center">
          <PhotoSlot src={card.photoSrc} name={card.fullName} size="lg" ring onDark />
        </div>

        <p className="mt-3 text-center text-sm text-cream/85">{card.location}</p>
        <h1
          id="titulo-pagina"
          tabIndex={-1}
          className="mt-2 text-center text-[2rem] leading-[1.05] font-semibold tracking-[-0.04em] outline-none focus:outline-none focus-visible:outline-none"
        >
          {card.fullName}
        </h1>
        <p className="mt-2 text-center text-base text-cream">{card.role}</p>

        {chips.length > 0 ? (
          <ul className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Áreas de atuação">
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full bg-cream/15 px-3 py-1.5 text-xs font-medium tracking-wide text-cream ring-1 ring-cream/35"
              >
                {chip}
              </li>
            ))}
          </ul>
        ) : null}

        {current ? (
          <div
            className="mt-4 flex min-h-0 flex-1 flex-col lg:flex-none"
            role="region"
            aria-roledescription="carrossel"
            aria-label="Informações de Camila"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
            }}
          >
            <motion.div
              className="glass flex w-full flex-col rounded-lg px-5 py-5 text-ink"
              tabIndex={0}
              onKeyDown={onCarouselKey}
              onPanEnd={(_, info) => {
                if (info.offset.x < -SWIPE_PX) go(1);
                if (info.offset.x > SWIPE_PX) go(-1);
              }}
            >
              <p className="sr-only">Use as setas do teclado para passar as informações.</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${current.label}-${current.title}`}
                  className="flex flex-col"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.28, ease: easeOut }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
                    {current.label}
                  </p>
                  <p className="mt-3 text-[1.2rem] leading-snug font-semibold tracking-[-0.03em] text-pretty break-words">
                    {current.title}
                  </p>
                  {current.detail ? (
                    <p className="mt-3 text-sm leading-relaxed text-pretty break-words text-muted">
                      {current.detail}
                    </p>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {slides.length > 1 ? (
              <ol className="mt-3 flex items-center justify-center gap-1">
                {slides.map((slide, slideIndex) => (
                  <li key={`${slide.label}-${slide.title}`}>
                    <button
                      type="button"
                      className="focus-ring-cream grid size-11 place-items-center"
                      aria-label={`${slide.label}, ${slideIndex + 1} de ${slides.length}`}
                      aria-current={slideIndex === index ? "true" : undefined}
                      onClick={() => setIndex(slideIndex)}
                    >
                      <span
                        className={`size-2.5 rounded-full ${
                          slideIndex === index ? "bg-cream" : "bg-cream/35"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
