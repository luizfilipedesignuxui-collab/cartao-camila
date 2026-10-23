export function InkScene() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <img
        src="/fundo-flor.png"
        alt=""
        width={1413}
        height={2124}
        decoding="async"
        className="absolute -right-10 -bottom-6 h-[18rem] w-auto max-w-none opacity-[0.16] brightness-0 invert sm:h-[22rem] lg:-right-16 lg:-bottom-10 lg:h-[28rem] lg:opacity-[0.12]"
      />
    </div>
  );
}
