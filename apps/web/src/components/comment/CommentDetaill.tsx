"use client";

import Image from "next/image";
import React from "react";

/* ----------------------- small pieces ----------------------- */

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const color = v < 40 ? "bg-red-500" : v < 70 ? "bg-yellow-400" : "bg-green-500";

  return (
    <div className="relative h-6 w-full overflow-hidden rounded-full bg-gray-200">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${v}%` }} />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
        {v}%
      </span>
    </div>
  );
}

function Card({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <div className="mb-3 text-[#0c4a4e]">{title}</div>
      {children}
    </div>
  );
}

function BulletList({ items, variant }: { items: string[]; variant: "pros" | "cons" }) {
  const bulletColor = variant === "pros" ? "text-emerald-600" : "text-rose-600";
  const mark = variant === "pros" ? "+" : "–";
  return (
    <ul className="space-y-2 text-sm">
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className={`${bulletColor} text-lg leading-none`}>{mark}</span>
          <span className="text-gray-700">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function ImageGallery({ main, thumbs }: { main: string; thumbs: string[] }) {
  const [active, setActive] = React.useState(main);
  React.useEffect(() => setActive(main), [main]);

  return (
    <div className="space-y-4">
      {/* تصویر اصلی */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-md">
        <Image
          src={active}
          alt="product"
          width={800}
          height={600}
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      {/* بندانگشتی‌ها */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {thumbs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(t)}
            className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white shadow ${
              active === t ? "" : ""
            }`}
            aria-label={`image ${i + 1}`}
          >
            <Image src={t} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- page --------------------------- */

export default function CommentDetail() {
  // داده نمونه — از API خودت بگیر
  const title = "موبایل اس 23 اولترا";
  const publishDate = "1400/5/23";
  const score = 80;

  const pros = Array(8).fill("سلامِ خوبه");
  const cons = Array(8).fill("سلام بده");

  const mainImage = "/product/Untitled.jpg";
  const gallery = [
    "/product/Untitled.jpg",
    "/product/Untitled.jpg",
    "/product/Untitled.jpg",
    "/product/Untitled.jpg",
    "/product/Untitled.jpg",
  ];

  const description =
    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. " +
    "چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز " +
    "و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. " +
    "بسیاری از طراحان گرافیک و برنامه‌نویسان...";

  return (
    <main dir="rtl" className="bg-[#f5f7f6]">
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6">
        {/* هدر: عنوان + تاریخ + نوار امتیاز */}
        <header className="mb-4">
          <div className="mb-2 text-sm text-gray-600">تاریخ انتشار: {publishDate}</div>
          <h1 className="mb-3 text-2xl font-extrabold text-[#0c4a4e] sm:text-3xl">{title}</h1>
          <div className="rounded-2xl bg-white p-2 shadow-md">
            <ProgressBar value={score} />
          </div>
        </header>

        {/* بدنه: چپ تصاویر، راست محتوا */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* ستون چپ (تصویر و گالری) */}
          <aside className="md:col-span-5 lg:col-span-4">
            <ImageGallery main={mainImage} thumbs={gallery} />
          </aside>

          {/* ستون راست (مزایا/معایب + توضیحات) */}
          <section className="md:col-span-7 lg:col-span-8 space-y-4">
            {/* باکس‌های مزایا/معایب */}
            <div className="grid grid-cols-2 gap-4">
              <Card title="مزایا">
                <BulletList items={pros} variant="pros" />
              </Card>
              <Card title="معایب">
                <BulletList items={cons} variant="cons" />
              </Card>
            </div>

            {/* توضیحات بلند */}
            <Card title="توضیحات">
              <div className="max-h-[360px] overflow-auto pr-1 text-justify leading-8 text-gray-700">
                {description.repeat(4)}
              </div>
            </Card>
          </section>
        </div>
      </section>
    </main>
  );
}
