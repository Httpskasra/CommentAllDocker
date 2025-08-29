"use client";

import React from "react";

/* Types */
type Message = {
  id: string;
  author: "me" | "other";
  name: string;
  text: string;
  time: string;
  replyTo?: { id: string; text: string };
};

/* Demo data */
const SAMPLE: Message[] = [
  {
    id: "m1",
    author: "other",
    name: "رضا صالحی",
    text: "چطور بود؟",
    time: "1402/02/12 16:40",
  },
  {
    id: "m2",
    author: "me",
    name: "شما",
    text: "خوب بود، روان بود، خدا رو شکر.",
    time: "1402/02/12 16:42",
  },
];

/* helpers */
const cls = (...s: Array<string | false | null | undefined>) => s.filter(Boolean).join(" ");

function ReplyChipInline({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 mr-1 inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 transition"
      title="پرش به پیام مرجع"
    >
      <span className="rotate-180 select-none">↩</span>
      <span className="line-clamp-1 text-right">{text}</span>
    </button>
  );
}

function MessageBubble({ m, onReply }: { m: Message; onReply: (m: Message) => void }) {
  const mine = m.author === "me";

  return (
    <div
      id={`msg-${m.id}`}
      className={cls(
        "flex w-full items-end gap-2 scroll-mt-24",
        mine ? "justify-end" : "justify-start",
      )}
      dir="rtl"
    >
      {!mine && <div className="min-w-[42px]" />}

      <div
        className={cls(
          "max-w-[78%] rounded-3xl px-4 py-2 shadow-sm ring-1 transition",
          mine ? "bg-white ring-slate-200" : "bg-slate-50 ring-slate-200",
        )}
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-600">{m.name}</span>
            <span className="opacity-50">🔒</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onReply(m)}
              className="text-xs text-[#0c4a4e] hover:underline"
              title="پاسخ"
            >
              ↩ پاسخ
            </button>
            <span className="text-[10px] text-slate-400">{m.time}</span>
          </div>
        </div>

        {m.replyTo && (
          <ReplyChipInline
            text={m.replyTo.text}
            onClick={() => {
              const el = document.getElementById(`msg-${m.replyTo!.id}`);
              if (!el) return;
              el.classList.add("ring-2", "ring-[#0c4a4e]/60");
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(() => el.classList.remove("ring-2", "ring-[#0c4a4e]/60"), 1200);
            }}
          />
        )}

        <p className="whitespace-pre-wrap leading-7 text-slate-800">{m.text}</p>
      </div>

      {mine && <div className="min-w-[42px]" />}
    </div>
  );
}

export default function Conversation() {
  const [messages, setMessages] = React.useState<Message[]>(SAMPLE);
  const [draft, setDraft] = React.useState("");
  const [replyingTo, setReplyingTo] = React.useState<Message | null>(null);

  const endRef = React.useRef<HTMLDivElement | null>(null);

  const submit = () => {
    const t = draft.trim();
    if (!t) return;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const id = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id,
        author: "me",
        name: "شما",
        text: t,
        time: `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(
          now.getDate(),
        )} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
        replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text } : undefined,
      },
    ]);
    setDraft("");
    setReplyingTo(null);
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7f6] py-6">
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        <h1 className="mb-4 text-2xl font-extrabold text-[#0c4a4e] sm:text-3xl">گفتگو</h1>

        {/* Composer */}
        <div className="mb-5 rounded-3xl bg-[#dbe7e6] p-3 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <span className="px-2 text-sm text-slate-700">اضافه کردن بازخورد</span>
            <button
              onClick={submit}
              className="rounded-full bg-[#0c4a4e] px-4 py-1.5 text-white shadow transition hover:shadow-md"
            >
              ثبت
            </button>
          </div>

          {/* reply preview */}
          {replyingTo && (
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
              <ReplyChipInline
                text={replyingTo.text}
                onClick={() => {
                  const el = document.getElementById(`msg-${replyingTo.id}`);
                  if (!el) return;
                  el.classList.add("ring-2", "ring-[#0c4a4e]/60");
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  setTimeout(() => el.classList.remove("ring-2", "ring-[#0c4a4e]/60"), 1200);
                }}
              />
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 hover:bg-slate-200"
                title="لغو ریپلای"
              >
                لغو
              </button>
            </div>
          )}

          <div className="mt-3">
            <textarea
              rows={3}
              placeholder={replyingTo ? "پاسخ خود را بنویسید..." : "متن پیام شما..."}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
              }}
              className="w-full rounded-2xl bg-white px-4 py-3 text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-[#0c4a4e]/40"
            />
            <div className="mt-2 text-xs text-slate-500">
              ارسال سریع: <kbd className="rounded bg-slate-200 px-1">Ctrl</kbd> +{" "}
              <kbd className="rounded bg-slate-200 px-1">Enter</kbd>
            </div>
          </div>
        </div>

        {/* Thread */}
        <div className="rounded-3xl bg-white/60 p-3 sm:p-4 shadow-sm ring-1 ring-slate-200">
          <div className="space-y-8">
            {messages.map((m) => (
              <MessageBubble key={m.id} m={m} onReply={(msg) => setReplyingTo(msg)} />
            ))}
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </main>
  );
}
