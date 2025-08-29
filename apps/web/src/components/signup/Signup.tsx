"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [busy, setBusy] = useState(false);

  function handleChange(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.email ||
      !form.username ||
      form.password.length < 6 ||
      form.password !== form.confirm ||
      !form.agree
    )
      return;
    setBusy(true);
    // 🔹 Call your signup logic here
    setTimeout(() => setBusy(false), 1200);
  }

  return (
    <main className="min-h-screen w-full bg-[#f3fbfb] flex items-center justify-center p-4">
      <section className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl bg-white grid grid-cols-1 md:grid-cols-2">
        {/* Right / Form */}
        <div className="bg-[#0B5A5C] text-white p-8 md:p-10 flex items-center">
          <form dir="rtl" className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-2">ساخت حساب کاربری</h2>

            {/* Email */}
            <label className="space-y-2">
              <span className="block">ایمیل:</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full rounded-lg bg-white/95 text-[#0b5a5c] px-4 py-3 outline-none ring-2 ring-transparent focus:ring-white/60 transition"
              />
            </label>

            {/* Username */}
            <label className="space-y-2">
              <span className="block">نام کاربری:</span>
              <input
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="نام کاربری شما"
                required
                className="w-full rounded-lg bg-white/95 text-[#0b5a5c] px-4 py-3 outline-none ring-2 ring-transparent focus:ring-white/60 transition"
              />
            </label>

            {/* Password */}
            <label className="space-y-2">
              <span className="block">رمز عبور:</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg bg-white/95 text-[#0b5a5c] px-4 py-3 outline-none ring-2 ring-transparent focus:ring-white/60 transition"
              />
            </label>

            {/* Confirm */}
            <label className="space-y-2">
              <span className="block">تکرار رمز عبور:</span>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => handleChange("confirm", e.target.value)}
                placeholder="تکرار رمز عبور"
                required
                className="w-full rounded-lg bg-white/95 text-[#0b5a5c] px-4 py-3 outline-none ring-2 ring-transparent focus:ring-white/60 transition"
              />
            </label>

            {/* Agree */}
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm">قوانین و مقررات را می‌پذیرم</span>
              <button
                type="button"
                aria-pressed={form.agree}
                onClick={() => handleChange("agree", !form.agree)}
                className={`relative h-6 w-11 rounded-full transition ${
                  form.agree ? "bg-white/90" : "bg-white/40"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#0B5A5C] transition-transform ${
                    form.agree ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="mt-1 rounded-lg bg-white text-[#0B5A5C] py-3 font-bold hover:bg-white/90 active:scale-[0.99] transition disabled:opacity-60"
            >
              {busy ? "در حال ارسال..." : "عضویت"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <span className="h-px flex-1 bg-white/30" />
              <span className="text-xs text-white/90">یا</span>
              <span className="h-px flex-1 bg-white/30" />
            </div>

            {/* Google Sign-up (نمایشی) */}
            <button
              type="button"
              className="rounded-lg bg-white/10 backdrop-blur px-4 py-3 font-medium hover:bg-white/15 border border-white/20"
            >
              عضویت با Google
            </button>

            {/* Links */}
            <div className="text-sm space-y-2 mt-2">
              <Link href="/login" className="hover:underline">
                حساب دارید؟ وارد شوید
              </Link>
            </div>
          </form>
        </div>

        {/* Left / Brand */}
        <div className="bg-[#E6F6F6] flex flex-col items-center justify-center gap-6 p-8">
          <div className="rounded-2xl overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="Nazarify Icon"
              width={220}
              height={220}
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083e40] text-center leading-snug">
            Nazarify | <span className="font-extrabold">نظریفای</span>
          </h1>
        </div>
      </section>
    </main>
  );
}
