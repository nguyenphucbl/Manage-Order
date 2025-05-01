"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

export default function NavItems({ className }: { className?: string }) {
  const pathname = usePathname();
  return menuItems.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        key={item.href}
        className={cn(
          className,
          "transition-colors hover:text-foreground",
          isActive ? "font-medium text-primary" : "text-muted-foreground"
        )}
      >
        {item.title}
      </Link>
    );
  });
}
