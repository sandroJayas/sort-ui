import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 sm:py-8 px-6 sm:px-8 md:px-12 border-t-2 border-[#F8B24E]/20 bg-[#0F1A7D]">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xl sm:text-2xl font-black tracking-tighter text-[#F8B24E]">
          SORT
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex gap-6 sm:gap-8 text-[10px] sm:text-xs tracking-widest text-white/60 font-bold"
        >
          <Link
            href="/terms"
            className="hover:text-[#F8B24E] transition-colors focus:outline-none focus:text-[#F8B24E]"
          >
            TERMS
          </Link>
          <Link
            href="/privacy"
            className="hover:text-[#F8B24E] transition-colors focus:outline-none focus:text-[#F8B24E]"
          >
            PRIVACY
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#F8B24E] transition-colors focus:outline-none focus:text-[#F8B24E]"
          >
            CONTACT
          </Link>
        </nav>
        <div className="text-[10px] sm:text-xs text-white/40 font-bold">
          © 2025 NYC
        </div>
      </div>
    </footer>
  );
}
