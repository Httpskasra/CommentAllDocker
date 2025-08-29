"use client";

import Image from "next/image";

type Feature = {
  icon: string;
  title: string;
  desc: string;
  bg: string;
};

const features: Feature[] = [
  {
    icon: "/images/true.png",
    title: "نظرات واقعی",
    desc: "فقط تجربه‌های واقعی نمایش داده می‌شوند.",
    bg: "bg-[#8BC34A]", // سبز
  },
  {
    icon: "/images/noAds.png",
    title: "بدون تبلیغات",
    desc: "هیچ اسپانسری روی نظرات تأثیر ندارد.",
    bg: "bg-[#9C27B0]", // بنفش
  },
  {
    icon: "/images/fast.png",
    title: "سریع و ساده",
    desc: "در چند ثانیه نظر بدهید یا بخوانید.",
    bg: "bg-[#E57373]", // قرمز ملایم
  },
  {
    icon: "/images/social.png",
    title: "جامعه‌ای فعال",
    desc: "هزاران کاربر تجربه‌هایشان را به اشتراک می‌گذارند.",
    bg: "bg-[#2196F3]", // آبی
  },
];

export default function WhyUs() {
  return (
    <section dir="rtl" className="py-12 ">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="mb-10 text-2xl font-extrabold text-[#0c4a4e] sm:text-3xl">چرا ما؟</h2>

        {/* Grid چهار کارت */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`${f.bg} rounded-3xl p-6 flex flex-col items-center text-white shadow-md transition hover:scale-105`}
            >
              <Image src={f.icon} alt={f.title} width={80} height={80} className="mb-4" />
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-white/90">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
