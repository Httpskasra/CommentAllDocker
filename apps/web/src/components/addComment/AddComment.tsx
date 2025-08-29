"use client";

import React from "react";

type Thumb = { id: string; url: string; file: File };

export default function AddComment() {
  // fields
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");

  // pros/cons
  const [pros, setPros] = React.useState<string[]>([]);
  const [cons, setCons] = React.useState<string[]>([]);
  const [proDraft, setProDraft] = React.useState("");
  const [conDraft, setConDraft] = React.useState("");
  const proInputRef = React.useRef<HTMLInputElement>(null);
  const conInputRef = React.useRef<HTMLInputElement>(null);

  // desc
  const [desc, setDesc] = React.useState("");

  // rating
  const [rating, setRating] = React.useState(50);

  // checks
  const [agree, setAgree] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  // images
  const [thumbs, setThumbs] = React.useState<Thumb[]>([]);

  // helpers
  const addPro = () => {
    const v = proDraft.trim();
    if (!v) return proInputRef.current?.focus();
    setPros((p) => [...p, v]);
    setProDraft("");
  };
  const addCon = () => {
    const v = conDraft.trim();
    if (!v) return conInputRef.current?.focus();
    setCons((p) => [...p, v]);
    setConDraft("");
  };
  const removePro = (idx: number) => setPros((p) => p.filter((_, i) => i !== idx));
  const removeCon = (idx: number) => setCons((p) => p.filter((_, i) => i !== idx));

  const onUpload = (files?: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 8);
    const next = arr.map((f) => ({
      id: `${f.name}-${f.size}-${crypto.randomUUID()}`,
      url: URL.createObjectURL(f),
      file: f,
    }));
    setThumbs((t) => [...t, ...next].slice(0, 8));
  };

  const publish = () => {
    if (!agree) return alert("لطفاً قوانین سایت را تایید کنید.");
    console.log({
      title,
      category,
      pros,
      cons,
      desc,
      rating,
      agree,
      showProfile,
      thumbs,
    });
    alert("ارسال شد!");
  };

  return (
    <form
      dir="rtl"
      onSubmit={(e) => {
        e.preventDefault();
        publish();
      }}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-6 bg-[#f4f7f6] rounded-3xl"
    >
      {/* نکته مهم: در موبایل تک‌ستونه؛ از md به بالا دو ستونه */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right *:min-w-0">
        {/* 1) عنوان نظر */}
        <label className="order-1 md:order-none block">
          <span className="mb-1 block text-gray-700">عنوان نظر</span>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] px-5 py-3 outline-none focus:ring-2 focus:ring-[#0c4a4e]/30"
          />
        </label>

        {/* 2) دسته‌بندی */}
        <label className="order-2 md:order-none block">
          <span className="mb-1 block text-gray-700">دسته بندی</span>
          <input
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] px-5 py-3 outline-none"
          />
        </label>

        {/* 3) مزایا */}
        <label className="order-3 md:order-none block">
          <span className="mb-1 block text-gray-700">مزایا:</span>
          <div className="flex items-center gap-2">
            <input
              ref={proInputRef}
              value={proDraft}
              onChange={(e) => setProDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPro())}
              className="w-full rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] px-5 py-3 outline-none"
              placeholder="یک مزیت بنویس و Enter یا + بزن"
            />
            <button
              type="button"
              onClick={addPro}
              className="rounded-full bg-gray-200 px-5 py-3 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]"
              aria-label="افزودن مزیت"
              title="افزودن"
            >
              +
            </button>
          </div>

          {!!pros.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {pros.map((p, i) => (
                <span
                  key={`pro-${i}`}
                  className="group inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm shadow"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => removePro(i)}
                    className="opacity-60 group-hover:opacity-100"
                    aria-label="حذف"
                    title="حذف"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {pros.map((p, i) => (
            <input key={`p-hidden-${i}`} type="hidden" name="pros[]" value={p} />
          ))}
        </label>

        {/* 4) معایب */}
        <label className="order-4 md:order-none block">
          <span className="mb-1 block text-gray-700">معایب:</span>
          <div className="flex items-center gap-2">
            <input
              ref={conInputRef}
              value={conDraft}
              onChange={(e) => setConDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCon())}
              className="w-full rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] px-5 py-3 outline-none"
              placeholder="یک عیب بنویس و Enter یا + بزن"
            />
            <button
              type="button"
              onClick={addCon}
              className="rounded-full bg-gray-200 px-5 py-3 shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]"
              aria-label="افزودن عیب"
              title="افزودن"
            >
              +
            </button>
          </div>

          {!!cons.length && (
            <div className="mt-2 flex flex-wrap gap-2">
              {cons.map((c, i) => (
                <span
                  key={`con-${i}`}
                  className="group inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm shadow"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => removeCon(i)}
                    className="opacity-60 group-hover:opacity-100"
                    aria-label="حذف"
                    title="حذف"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {cons.map((c, i) => (
            <input key={`c-hidden-${i}`} type="hidden" name="cons[]" value={c} />
          ))}
        </label>

        {/* 5) توضیحات */}
        <label className="order-5 md:order-none block md:col-span-1">
          <span className="mb-1 block text-gray-700">توضیحات:</span>
          <textarea
            name="description"
            rows={6}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] px-5 py-4 outline-none resize-none"
          />
        </label>

        {/* 6) بارگذاری تصویر */}
        <div className="order-6 md:order-none md:col-span-1 space-y-3">
          <label className="inline-flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => onUpload(e.target.files)}
            />
            <span
              className="rounded-full bg-[#3b82f6] px-5 py-2.5 text-white shadow cursor-pointer select-none"
              onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement)?.click()}
            >
              بارگذاری تصویر
            </span>
          </label>

          {!!thumbs.length && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {thumbs.map((t) => (
                <div key={t.id} className="rounded-md bg-white shadow overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.url} alt="" className="h-16 w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7) امتیازدهی */}
        <div className="order-7 md:order-none space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">امتیاز دهی</span>
            <span className="text-sm text-gray-500">{rating}%</span>
          </div>

          <div className="relative rounded-xl bg-white shadow p-2">
            {/* نمایشی (رویداد نگیرد) */}
            <div className="pointer-events-none h-6 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  rating < 40 ? "bg-red-500" : rating < 70 ? "bg-yellow-400" : "bg-green-500"
                }`}
                style={{ width: `${rating}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                {rating}%
              </span>
            </div>
            {/* input واقعی فرم (روی لایه) */}
            <input
              name="rating"
              type="range"
              min={0}
              max={100}
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="absolute inset-0 z-10 opacity-0 cursor-pointer"
              aria-label="امتیاز"
            />
          </div>
        </div>

        {/* 8) قوانین + نمایش مشخصات */}
        <div className="order-8 md:order-none space-y-4 pt-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="peer hidden"
            />
            <span
              className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full bg-gray-300 after:absolute after:right-1 after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#0c4a4e] peer-checked:after:right-[22px]"
              aria-hidden
            />
            <span className="text-gray-700">قوانین سایت را تایید میکنم</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showProfile}
              onChange={(e) => setShowProfile(e.target.checked)}
              className="peer hidden"
            />
            <span
              className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full bg-gray-300 after:absolute after:right-1 after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#0c4a4e] peer-checked:after:right-[22px]"
              aria-hidden
            />
            <span className="text-gray-700">نمایش مشخصات</span>
          </label>
        </div>

        {/* 9) انتشار */}
        <div className="order-9 md:order-none pt-2 md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-full bg-[#0c4a4e] py-3 text-white shadow-md transition hover:shadow-lg"
          >
            انتشار
          </button>
        </div>
      </div>
    </form>
  );
}
