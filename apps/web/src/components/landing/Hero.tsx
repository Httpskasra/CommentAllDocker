"use client";

import Image from "next/image";

type HeroProps = {
  titleFa?: string;
  titleEn?: string;
  line1?: string;
  line2?: string;
  ctaText?: string;
  onCta?: () => void;
  illustrationSrc?: string;
  plusIconSrc?: string;
  className?: string;
};

export default function Hero({
  titleFa = "نظریفای",
  titleEn = "Nazarify",
  line1 = "جایی برای تجربه‌های واقعی، نه تبلیغات.",
  line2 = "تجربه‌ات رو بگو، به دیگران کمک کن.",
  ctaText = "ثبت نظر",
  onCta,
  illustrationSrc = "/images/hero-ilusion.png",
  plusIconSrc = "/images/plus.svg",
  className,
}: HeroProps) {
  const base = "w-full ";
  return (
    <section dir="rtl" className={className ? `${base} ${className}` : base}>
      <div className="mx-auto flex max-w-6xl items-center justify-between max-h-[500px] px-4 py-10 sm:px-6 md:py-16 lg:py-20 gap-6">
        {/* متن راست */}
        <div className="flex-1 text-right">
          <h1 className="mb-4 text-2xl font-extrabold text-[#0c4a4e] sm:text-3xl md:text-4xl lg:text-5xl">
            <span>{titleFa}</span>
            <span className="mx-2 text-[#0c4a4e]/80">|</span>
            <span>{titleEn}</span>
          </h1>

          <p className="mb-2 text-sm text-slate-700 sm:text-base md:text-lg">{line1}</p>
          <p className="mb-6 text-sm text-slate-700 sm:text-base md:text-lg">{line2}</p>

          <button
            onClick={onCta}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0c4a4e] px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm md:text-base text-white shadow-md transition hover:shadow-lg"
          >
            {ctaText}
            <Image src={plusIconSrc} alt="" width={16} height={16} />
          </button>
        </div>

        {/* تصویر چپ */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-[500px] sm:max-w-[450px] md:max-w-[520px]">
            <Image
              src={illustrationSrc}
              alt="نظریفای - تجربه‌های واقعی"
              width={500}
              height={300}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
