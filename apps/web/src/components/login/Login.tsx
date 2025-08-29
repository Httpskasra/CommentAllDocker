"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [remember, setRemember] = useState(true);

  return (
    <main className="min-h-screen w-full bg-[#f3fbfb] flex items-center justify-center p-4">
      {/* Wrapper */}
      <section className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl bg-white grid grid-cols-1 md:grid-cols-2">
        {/* Right / Form */}
        <div className="bg-[#0B5A5C] text-white p-8 md:p-10 flex items-center">
          <form
            dir="rtl"
            className="w-full flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              // اینجا لاجیک لاگین خودت رو صدا بزن
            }}
          >
            <h2 className="text-xl font-bold mb-2">ورود</h2>

            {/* Email */}
            <label className="space-y-2">
              <span className="block">ایمیل:</span>
              <input
                type="email"
                required
                placeholder="example@email.com"
                className="w-full rounded-lg bg-white/95 text-[#0b5a5c] px-4 py-3 outline-none ring-2 ring-transparent focus:ring-white/60 transition"
              />
            </label>

            {/* Password */}
            <label className="space-y-2">
              <span className="block">پسورد:</span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg bg-white/95 text-[#0b5a5c] px-4 py-3 outline-none ring-2 ring-transparent focus:ring-white/60 transition"
              />
            </label>

            {/* Remember me */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm">مرا به خاطر بسپار</span>
              <button
                type="button"
                aria-pressed={remember}
                onClick={() => setRemember((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition ${
                  remember ? "bg-white/90" : "bg-white/40"
                }`}
                title="toggle remember me"
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#0B5A5C] transition-transform ${
                    remember ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-1 rounded-lg bg-white text-[#0B5A5C] py-3 font-bold hover:bg-white/90 active:scale-[0.99] transition"
            >
              ورود
            </button>

            {/* Divider (optional Google) */}
            <div className="flex items-center gap-3 my-1">
              <span className="h-px flex-1 bg-white/30" />
              <span className="text-xs text-white/90">یا</span>
              <span className="h-px flex-1 bg-white/30" />
            </div>

            {/* Google Sign-in (نمایشی) */}
            <button
              type="button"
              className="rounded-lg bg-white/10 backdrop-blur px-4 py-3 font-medium hover:bg-white/15 border border-white/20"
            >
              ورود با Google
            </button>

            {/* Links */}
            <div className="text-sm space-y-2 mt-2">
              <Link href="/forgot-password" className="hover:underline">
                آیا رمز عبور خود را فراموش کرده‌اید؟
              </Link>
              <br />
              <Link href="/signup" className="hover:underline">
                ساخت حساب کاربری جدید
              </Link>
            </div>
          </form>
        </div>
        {/* Left / Brand */}
        <div className="bg-[#E6F6F6] flex flex-col items-center justify-center gap-6 p-8">
          <div className="rounded-2xl overflow-hidden">
            {/* لوگو (دلخواه: مسیر خودت رو جایگزین کن) */}
            <Image
              src="/logo.jpg" // مثلا: /images/nazarify-icon.png
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
