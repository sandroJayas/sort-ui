import { ScrollAnimator } from "./ScrollAnimator";

const stats = [
  { value: "$55", label: "SIMPLE PRICING", suffix: "/mo", color: "#1724B6" },
  { value: "UNLIMITED", label: "FREE RETURNS", suffix: "", color: "#F8B24E" },
  { value: "24", label: "CUSTOMER SUPPORT", suffix: "HR", color: "#1724B6" },
];

export function StatsSection() {
  return (
    <section className="w-screen ml-[calc(-50vw+50%)] py-32 relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1724B6]/5 via-[#F8B24E]/5 to-[#1724B6]/5" />
      <div className="relative px-8 md:px-12">
        <ScrollAnimator>
          <div className="flex flex-col md:flex-row gap-16 md:gap-32 justify-center items-center">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="relative animate-on-scroll"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-baseline gap-2 justify-center">
                  <span
                    className="text-[8vw] md:text-[6vw] font-black tracking-tighter"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-2xl md:text-3xl font-bold opacity-60"
                    style={{ color: stat.color }}
                  >
                    {stat.suffix}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-[#0F1A7D] font-black mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimator>
      </div>
    </section>
  );
}
