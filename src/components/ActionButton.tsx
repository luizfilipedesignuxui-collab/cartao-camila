import { ArrowUpRight } from "lucide-react";
import { newWindowLabel } from "../lib/a11y.ts";
import type { CardAction } from "../lib/actions.ts";
import { ActionIcon } from "./ActionIcon.tsx";

type ActionButtonProps = {
  action: CardAction;
  expanded?: boolean;
  onActivate?: () => void;
  tone?: "light" | "dark";
};

const rowClass = {
  light: "action-row focus-ring flex min-h-14 w-full items-center gap-3 rounded-md px-4 py-3 text-left",
  dark: "glass focus-ring flex min-h-14 w-full items-center gap-3 rounded-md px-4 py-3 text-left text-ink",
} as const;

export function ActionButton({ action, onActivate, tone = "light" }: ActionButtonProps) {
  const name = newWindowLabel(`${action.label}. ${action.description}`, action.external);
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-media/10 text-ink" aria-hidden="true">
        <ActionIcon id={action.id} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-ink">{action.label}</span>
        <span className="mt-0.5 block text-sm leading-snug break-words text-muted">
          {action.description}
        </span>
      </span>
      {action.external ? (
        <ArrowUpRight className="size-4 shrink-0 text-muted" aria-hidden="true" />
      ) : null}
    </>
  );

  if (action.href) {
    return (
      <a
        className={rowClass[tone]}
        href={action.href}
        aria-label={name}
        {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(action.download ? { download: action.download } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={rowClass[tone]} onClick={onActivate} aria-label={name}>
      {content}
    </button>
  );
}
