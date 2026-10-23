import { ActionIcon } from "./ActionIcon.tsx";

export type ChannelId = "whatsapp" | "linkedin" | "email";

const markClass: Record<ChannelId, string> = {
  whatsapp: "bg-brand-whatsapp",
  linkedin: "bg-brand-linkedin",
  email: "bg-ink",
};

type ChannelMarkProps = {
  id: ChannelId;
  active?: boolean;
};

export function ChannelMark({ id, active = false }: ChannelMarkProps) {
  return (
    <span
      className={`channel-dot grid size-14 place-items-center rounded-full ${markClass[id]} ${
        active ? "channel-dot-active" : ""
      }`}
      aria-hidden="true"
    >
      <ActionIcon id={id} tone="onMedia" size="md" />
    </span>
  );
}
