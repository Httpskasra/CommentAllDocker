"use client";

import Image from "next/image";

type ShareCtaProps = {
  onCreateReview?: () => void;
  onSeeReviews?: () => void;
};

export default function ShareCta({ onCreateReview, onSeeReviews }: ShareCtaProps) {
  return (
    <section dir="rtl" className="py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="relative overflow-visible rounded-[28px] bg-gradient-to-br from-[#11B2EA] to-[#048FD5] px-6 py-10 text-white shadow-xl sm:px-10">
          <div className="pointer-events-none  absolute -top-15 -right-15 ">
            <Image
              src="/images/alert.png"
              alt="alert"
              width={140}
              height={140}
              className="select-none rotate-[40deg]"
            />
          </div>

          {/* content */}
          <div className="text-center">
            <h3 className="mx-auto max-w-2xl text-xl font-extrabold sm:text-3xl md:text-3xl leading-9">
              تجربیات مهمه! همین الان به اشتراک بگذار
              <br />
              هر نظرِ تو می‌تونه به هزاران نفر کمک کنه
            </h3>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {/* ثبت نظر */}
              <button
                onClick={onCreateReview}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 px-6 py-2 text-base font-medium hover:bg-white hover:text-[#0a6fb1] transition cursor-pointer"
              >
                ثبت نظر
                <Image
                  src="/images/plus.svg" // ✅ replaced plus
                  alt="plus"
                  width={18}
                  height={18}
                />
              </button>

              {/* مشاهده نظر */}
              <button
                onClick={onSeeReviews}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/90 px-6 py-2 text-base font-medium hover:bg-white hover:text-[#0a6fb1] transition"
              >
                مشاهده نظر
                <Image
                  src="/images/eye-solid-full.svg" // ✅ replaced eye
                  alt="eye"
                  width={18}
                  height={18}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
