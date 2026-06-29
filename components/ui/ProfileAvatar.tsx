// filepath: d:\pokerIQ\poker-web\components\ui\ProfileAvatar.tsx
"use client";

import Link from "next/link";

export function ProfileAvatar({ src, alt }: { src?: string | null; alt?: string }) {
  const img = src ?? "/images/avatar-placeholder.png";
  return (
    <Link href="/profile" aria-label="Profile">
      <img
        src={img}
        alt={alt ?? "Profile"}
        className="h-9 w-9 rounded-full border border-white/10 object-cover shadow-sm"
      />
    </Link>
  );
}