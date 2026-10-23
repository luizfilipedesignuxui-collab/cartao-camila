import { InkScene } from "./InkScene.tsx";

export function MissingCard() {
  return (
    <div className="relative h-dvh overflow-hidden bg-bg text-cream">
      <InkScene />
      <main className="relative z-10 mx-auto flex h-full max-w-md flex-col justify-center px-5">
        <p className="text-xs tracking-[0.16em] text-cream/90 uppercase">Cartão</p>
        <h1
          id="titulo-pagina"
          className="mt-2 text-[2rem] leading-none font-semibold tracking-[-0.04em] outline-none focus:outline-none focus-visible:outline-none"
        >
          Este cartão não está disponível
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-cream/90">
          O endereço não corresponde a um cartão público. Confira o link e tente de novo.
        </p>
      </main>
    </div>
  );
}
