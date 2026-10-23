import { isHttpUrl, qrPointsToLocalAddress } from "./contact.ts";

export type AppView = "card" | "entrega" | "conectar" | "missing";

export function parsePathname(pathname: string, slug = ""): AppView {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/entrega") return "entrega";
  if (clean === "/conectar") return "conectar";
  if (clean === "/") return "card";
  if (slug && clean === cardPath(slug)) return "card";
  if (!slug) return "card";
  return "missing";
}

export function cardPath(slug: string): string {
  const safe = slug.trim().replace(/^\/+|\/+$/g, "");
  return safe ? `/${safe}` : "/";
}

export function cardLayerPath(slug: string, layer: "identity" | "connection"): string {
  return `${cardPath(slug)}?layer=${layer}`;
}

export function entregaPath(): string {
  return "/entrega";
}

export function connectPath(): string {
  return "/conectar";
}

export function navigateTo(path: string): void {
  if (typeof window === "undefined") return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function envPublicUrl(): string {
  return (import.meta.env.VITE_CARD_PUBLIC_URL ?? "").trim();
}

export function resolvePublicCardUrl(options: {
  publicUrl: string;
  slug: string;
}): { url: string; isLocal: boolean } {
  const candidates = [envPublicUrl(), options.publicUrl.trim()];
  for (const candidate of candidates) {
    if (isHttpUrl(candidate) && !qrPointsToLocalAddress(candidate)) {
      return { url: candidate.replace(/\/+$/, ""), isLocal: false };
    }
  }

  if (typeof window === "undefined") {
    return { url: "", isLocal: true };
  }

  const url = `${window.location.origin}${cardPath(options.slug)}`;
  return { url, isLocal: qrPointsToLocalAddress(url) };
}

/** URL que o QR abre: o convite de conexão, no mesmo domínio do cartão. Nunca LinkedIn. */
export function resolveConnectUrl(publicCard: { url: string }): string {
  const base = publicCard.url.trim();
  if (!isHttpUrl(base)) return "";
  try {
    const url = new URL(base);
    url.pathname = connectPath();
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return "";
  }
}

export function entryQrValue(publicCard: { url: string }): string {
  return resolveConnectUrl(publicCard);
}
