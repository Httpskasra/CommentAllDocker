"use client";

import ProductCard from "@/components/comment/Comment";

const items = [
  { title: "محصول ۱" },
  { title: "محصول ۲" },
  { title: "محصول ۳" },
  { title: "محصول ۴" },
  { title: "محصول ۵" },
  { title: "محصول ۶" },
];

export default function CommentsGrid() {
  return (
    <section dir="rtl" className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-2xl font-extrabold text-[#0c4a4e] sm:text-3xl text-center">
          محصولات برتر
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <ProductCard key={item.title} title={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
