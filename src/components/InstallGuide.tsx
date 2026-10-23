import { useEffect, useState } from "react";
import {
  canPromptInstall,
  isAndroidDevice,
  isIosDevice,
  isStandaloneDisplay,
  promptInstall,
} from "../lib/pwa.ts";

type InstallGuideProps = {
  onStatus: (message: string) => void;
};

export function InstallGuide({ onStatus }: InstallGuideProps) {
  const [canInstall, setCanInstall] = useState(canPromptInstall());
  const standalone = isStandaloneDisplay();
  const ios = isIosDevice();
  const android = isAndroidDevice();

  useEffect(() => {
    const sync = () => setCanInstall(canPromptInstall());
    window.addEventListener("pwa-install-available", sync);
    return () => window.removeEventListener("pwa-install-available", sync);
  }, []);

  async function install() {
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      onStatus("O atalho foi confirmado neste navegador.");
      setCanInstall(false);
      return;
    }
    if (outcome === "dismissed") {
      onStatus("A instalação foi cancelada.");
      return;
    }
    onStatus("Este navegador não oferece o convite automático. Use o passo a passo abaixo.");
  }

  return (
    <div className="rounded-lg bg-cream px-5 py-5 text-ink">
      <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Adicionar ao celular</p>
      {standalone ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">O cartão já está aberto como atalho neste aparelho.</p>
      ) : (
        <>
          <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">
            O cartão abre no navegador. O atalho na tela inicial é opcional e não instala um aplicativo da loja.
          </p>
          {canInstall ? (
            <button
              type="button"
              className="cta focus-ring mt-4 flex min-h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold"
              onClick={() => void install()}
            >
              Instalar neste navegador
            </button>
          ) : null}
          <ol className="mt-4 space-y-3 text-sm leading-relaxed">
            {ios || !android ? (
              <li>
                <span className="font-semibold">iPhone, Safari.</span> Abra o cartão no Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.
              </li>
            ) : null}
            {android || !ios ? (
              <li>
                <span className="font-semibold">Android.</span> Abra o menu do Chrome e escolha Instalar aplicativo ou Adicionar à tela inicial.
              </li>
            ) : null}
          </ol>
        </>
      )}
    </div>
  );
}
