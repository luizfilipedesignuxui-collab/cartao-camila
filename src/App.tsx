import { useEffect, useState } from "react";
import { BusinessCard } from "./components/BusinessCard.tsx";
import { ConnectInvite } from "./components/ConnectInvite.tsx";
import { DeliveryView } from "./components/DeliveryView.tsx";
import { MissingCard } from "./components/MissingCard.tsx";
import { businessCard } from "./config/business-card.ts";
import { parsePathname, type AppView } from "./lib/app-location.ts";
import { fileSlug } from "./lib/contact.ts";
import { listenForInstallPrompt } from "./lib/pwa.ts";

const cardSlug = fileSlug(businessCard.fullName);

function useAppView(): AppView {
  const [view, setView] = useState<AppView>(() => parsePathname(window.location.pathname, cardSlug));

  useEffect(() => {
    const onPop = () => setView(parsePathname(window.location.pathname, cardSlug));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return view;
}

export default function App() {
  const view = useAppView();

  useEffect(() => {
    listenForInstallPrompt();
  }, []);

  if (view === "entrega") return <DeliveryView />;
  if (view === "conectar") return <ConnectInvite />;
  if (view === "missing") return <MissingCard />;
  return <BusinessCard />;
}
