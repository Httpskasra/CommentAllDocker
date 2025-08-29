"use client";

import Image from "next/image";
import Link from "next/link";

/* ---------- Types ---------- */
type ContactLink = { iconSrc: string; label: string; href: string };
type LinkItem = { label: string; href: string };
type LinkColumn = { title?: string; items: LinkItem[] };

type FooterProps = {
  year?: number;
  brandLine?: string;
  avatarSrc?: string;
  contacts?: ContactLink[];
  columns?: LinkColumn[];
  className?: string;
};

/* ---------- Defaults (outside component) ---------- */
const CONTACTS: ContactLink[] = [
  {
    iconSrc: "/images/mail.png",
    label: "amin.niazi2003@gmail.com",
    href: "mailto:commm@gmail.com",
  },
  {
    iconSrc: "/images/telegram.png",
    label: "t.me/httpkasra3773",
    href: "https://t.me/asdasdsd",
  },
  {
    iconSrc: "/images/whatsapp.png",
    label: "kasrarahmanian3@gmail.com",
    href: "mailto:commm@gmail.com",
  },
  {
    iconSrc: "/images/phone.png",
    label: "+989164532683",
    href: "tel:+989164532683",
  },
];

const COLUMNS: LinkColumn[] = [
  {
    items: [
      { label: "«صفحه اصلی»", href: "/" },
      { label: "«محصولات / شرکت‌ها»", href: "/products" },
      { label: "«ثبتِ نظر»", href: "/review" },
      { label: "«درباره ما»", href: "/about" },
    ],
  },
  {
    items: [
      { label: "قوانین و مقررات", href: "/terms" },
      { label: "حریم خصوصی", href: "/privacy" },
      { label: "ارتباط با ما", href: "/contact" },
    ],
  },
];

/* ---------- Tiny UI pieces ---------- */
const Avatar = ({ src, size = 80 }: { src: string; size?: number }) => (
  <div className="overflow-hidden rounded-full bg-white/70" style={{ width: size, height: size }}>
    <Image
      src={src}
      alt="Avatar"
      width={size}
      height={size}
      className="h-full w-full object-cover"
    />
  </div>
);

const ContactItem = ({ iconSrc, label, href }: ContactLink) => (
  <li className="flex items-center gap-3">
    <Image src={iconSrc} alt="" width={24} height={24} className="shrink-0" />
    <a href={href} className="underline-offset-4 decoration-white/40 hover:underline">
      {label}
    </a>
  </li>
);

const LinkGroup = ({ title, items }: LinkColumn) => (
  <nav aria-label={title ?? "لینک‌ها"}>
    {title && <p className="mb-2 font-medium">{title}</p>}
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} className="hover:opacity-80">
            {it.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

/* ---------- Footer ---------- */
export default function Footer({
  year = new Date().getFullYear(),
  brandLine = "پلتفرمی برای نظرات واقعی و بدون تبلیغ.",
  avatarSrc = "/logo.jpg",
  contacts = CONTACTS,
  columns = COLUMNS,
  className,
}: FooterProps) {
  const base =
    "mx-auto my-12 max-w-6xl rounded-[28px] bg-[#0c4a4e] px-6 py-8 text-white shadow-xl md:px-10 md:py-10";
  return (
    <footer dir="rtl" className={className ? `${base} ${className}` : base}>
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
        {/* Brand / Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar src={avatarSrc} />
          <p className="text-center text-sm text-white/90 md:text-base">{brandLine}</p>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-6 text-white/90">
          {columns.map((col, i) => (
            <LinkGroup key={i} {...col} />
          ))}
        </div>

        {/* Contacts */}
        <ul className="space-y-4">
          {contacts.map((c) => (
            <ContactItem key={`${c.href}-${c.label}`} {...c} />
          ))}
        </ul>
      </div>

      <div className="mt-8 border-t border-white/10 pt-4 text-center text-sm text-white/70">
        © {year} — همه حقوق محفوظ است.
      </div>
    </footer>
  );
}
