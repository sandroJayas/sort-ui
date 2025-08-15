import { ScrollAnimator } from "./ScrollAnimator";

const boroughs = [
  { name: "MANHATTAN", status: "LIVE", time: "2HR DELIVERY" },
  { name: "BROOKLYN", status: "LIVE", time: "3HR DELIVERY" },
  { name: "QUEENS", status: "LIVE", time: "2HR DELIVERY" },
];

export function NYCSection() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 md:px-12 bg-[#1724B6]">
      <ScrollAnimator>
        <h2 className="text-[10vw] sm:text-[8vw] md:text-[6vw] font-black tracking-tighter mb-12 sm:mb-16 animate-on-scroll">
          NYC
          <br />
          <span className="text-[#F8B24E] drop-shadow-[0_10px_20px_rgba(248,178,78,0.3)]">
            EXCLUSIVE
          </span>
        </h2>
      </ScrollAnimator>

      <ScrollAnimator>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {boroughs.map((b, i) => (
            <div
              key={b.name}
              className="relative group animate-on-scroll"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="p-6 sm:p-8 border-2 border-[#F8B24E]/30 bg-[#0F1A7D] hover:bg-[#F8B24E] hover:text-[#0F1A7D] hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-3 h-3 bg-[#10B981] group-hover:bg-[#0F1A7D] animate-pulse" />
                  <span className="text-[10px] sm:text-xs tracking-widest text-[#10B981] group-hover:text-[#0F1A7D] font-black">
                    {b.status}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter mb-1 sm:mb-2">
                  {b.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 group-hover:text-[#0F1A7D]/70 font-bold">
                  {b.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimator>
    </section>
  );
}
