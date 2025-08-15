export function ScrollIndicator() {
  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce-slow"
      aria-hidden
    >
      <div className="w-[2px] h-16 sm:h-20 bg-[#F8B24E]" />
    </div>
  );
}
