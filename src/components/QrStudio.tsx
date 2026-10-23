import { QRCodeCanvas } from "qrcode.react";
import { qrColors } from "../lib/qrColors.ts";
import { downloadCanvasPng } from "../lib/page.ts";

const HIRES_ID = "qr-profissional";

type QrStudioProps = {
  value: string;
  name: string;
  isLocal: boolean;
  onDownload: (ok: boolean) => void;
  onCopy: () => void;
  onShare: () => void;
};

export function QrStudio({ value, name, isLocal, onDownload, onCopy, onShare }: QrStudioProps) {
  function save() {
    onDownload(downloadCanvasPng(HIRES_ID, `${name}-qr.png`));
  }

  return (
    <section className="rounded-lg bg-cream px-5 py-5 text-ink" aria-labelledby="qr-profissional-titulo">
      <h2 id="qr-profissional-titulo" className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
        QR Code
      </h2>
      <div className="mx-auto mt-4 grid size-[13.5rem] place-items-center rounded-lg bg-qr-paper p-4">
        {value ? (
          <QRCodeCanvas
            id={HIRES_ID}
            value={value}
            size={512}
            level="H"
            marginSize={4}
            bgColor={qrColors.paper}
            fgColor={qrColors.ink}
            className="size-full"
          />
        ) : (
          <p className="text-center text-sm text-muted">Sem URL pública para o QR.</p>
        )}
      </div>
      {isLocal ? (
        <p className="mt-3 text-sm leading-relaxed text-muted" role="status">
          Este QR ainda aponta para um endereço local. Preencha a URL pública antes de imprimir.
        </p>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted">Área livre ao redor do código para leitura em tela e no papel.</p>
      )}
      <div className="mt-4 grid gap-2">
        <button
          type="button"
          className="cta focus-ring flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold"
          onClick={save}
          disabled={!value}
        >
          Baixar QR em alta resolução
        </button>
        <button
          type="button"
          className="focus-ring flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-ink ring-1 ring-line"
          onClick={onCopy}
          disabled={!value}
        >
          Copiar URL
        </button>
        <button
          type="button"
          className="focus-ring flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-ink ring-1 ring-line"
          onClick={onShare}
          disabled={!value}
        >
          Compartilhar o link
        </button>
      </div>
    </section>
  );
}
