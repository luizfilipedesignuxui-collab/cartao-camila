import { downloadBlob, shareFiles, type ShareResult } from "./contact.ts";
import { QR_CANVAS_ID } from "./page.ts";

const INK = "#000000";
const MEDIA = "#1a8c8d";
const WHITE = "#ffffff";
const WHITE_SOFT = "rgba(255, 255, 255, 0.85)";

type EntryCardInput = {
  photoSrc: string;
  logoSrc: string;
  fullName: string;
  role: string;
  specialty: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("imagem"));
    image.src = src;
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawCircleImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
) {
  context.save();
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.closePath();
  context.clip();
  const size = radius * 2;
  const scale = Math.max(size / image.width, size / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, cx - width / 2, cy - height / 2, width, height);
  context.restore();
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.strokeStyle = "rgba(240, 94, 35, 0.7)";
  context.lineWidth = 6;
  context.stroke();
}

export async function renderEntryCardBlob(card: EntryCardInput): Promise<Blob | null> {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = MEDIA;
  context.fillRect(0, 0, width, height);
  await drawInkScene(context, width, height);

  try {
    const logo = await loadImage(card.logoSrc);
    const logoW = 640;
    const logoH = (logo.height / logo.width) * logoW;
    context.drawImage(logo, 80, 80, logoW, logoH);
  } catch {
    context.fillStyle = WHITE;
    context.font = "700 72px Inter, Segoe UI, sans-serif";
    context.fillText(card.fullName, 80, 220);
  }

  context.font = "36px Inter, Segoe UI, sans-serif";
  context.fillStyle = WHITE;
  context.fillText(card.role, 80, 520);

  context.font = "30px Inter, Segoe UI, sans-serif";
  context.fillStyle = WHITE_SOFT;
  wrapText(context, card.specialty, 80, 580, 920, 40);

  try {
    const photo = await loadImage(card.photoSrc);
    drawCircleImage(context, photo, 250, 980, 150);
  } catch {
    context.beginPath();
    context.arc(250, 980, 150, 0, Math.PI * 2);
    context.fillStyle = "rgba(0, 0, 0, 0.08)";
    context.fill();
  }

  const qr = document.getElementById(QR_CANVAS_ID);
  context.fillStyle = "#ffffff";
  roundRect(context, 500, 780, 500, 560, 48);
  context.fill();
  if (qr instanceof HTMLCanvasElement) {
    context.drawImage(qr, 560, 840, 380, 380);
  }
  context.fillStyle = INK;
  context.font = "26px Inter, Segoe UI, sans-serif";
  context.textAlign = "center";
  context.fillText("Escaneie para abrir meu cartão digital.", 750, 1280);
  context.textAlign = "start";

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

async function drawInkScene(context: CanvasRenderingContext2D, width: number, height: number) {
  try {
    const art = await loadImage("/fundo-flor.png");
    const scale = Math.max(width / art.width, height / art.height);
    const drawW = art.width * scale;
    const drawH = art.height * scale;
    context.drawImage(art, width - drawW, height - drawH, drawW, drawH);
  } catch {
    /* fundo opcional na imagem salva */
  }
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cursor = y;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) {
      context.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) context.fillText(line, x, cursor);
}

export async function saveEntryCardToGallery(card: EntryCardInput, filename: string): Promise<ShareResult> {
  const blob = await renderEntryCardBlob(card);
  if (!blob) return "failed";
  const file = new File([blob], filename, { type: "image/png" });
  const shared = await shareFiles([file], card.fullName, "Primeira tela do cartão digital");
  if (shared === "shared" || shared === "cancelled") return shared;
  downloadBlob(blob, filename);
  return "downloaded";
}
