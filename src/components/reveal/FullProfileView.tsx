import type { BusinessCardConfig } from "../../config/business-card.ts";
import type { ActionId, CardAction } from "../../lib/actions.ts";
import { ConnectionView } from "./ConnectionView.tsx";
import { EvidenceView } from "./EvidenceView.tsx";
import { ExpertiseView } from "./ExpertiseView.tsx";
import { IdentityView } from "./IdentityView.tsx";

type FullProfileViewProps = {
  card: BusinessCardConfig;
  extras: readonly CardAction[];
  onAction: (id: ActionId) => void;
};

export function FullProfileView({ card, extras, onAction }: FullProfileViewProps) {
  return (
    <div className="flex flex-col gap-10">
      <IdentityView card={card} />
      <ExpertiseView card={card} />
      <EvidenceView card={card} />
      <ConnectionView card={card} extras={extras} onAction={onAction} />
    </div>
  );
}
