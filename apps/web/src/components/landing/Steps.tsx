"use client";

import Image from "next/image";

const steps = [
  {
    icon: "/images/help.png",
    label: "به بقیه کمک کن",
  },
  {
    icon: "/images/write.png",
    label: "تجربیات رو بنویس",
  },
  {
    icon: "/images/search.png",
    label: "جستجو کن",
  },
];

export default function Steps() {
  return (
    <section dir="rtl" className=" py-12">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 sm:gap-6">
            {/* دایره آبی */}
            <div className="flex h-22 w-22 sm:h-30 sm:w-30 md:h-40 md:w-40 flex-col items-center justify-center rounded-full bg-[#03A9F4] text-white shadow-lg shrink-0">
              <Image src={s.icon} alt={s.label} width={70} height={70} />
              <p className="my-0 text-[8px] font-bold sm:text-base">{s.label}</p>
            </div>

            {/* فلش (غیر از آخرین) */}
            {i < steps.length - 1 && (
              <span className="flex items-center justify-center text-[#03A9F4] text-l sm:text-2xl md:text-3xl shrink-0">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
