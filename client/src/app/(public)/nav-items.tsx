"use client";

import { useAppContext } from "@/components/app-provider";
import { cn, getFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
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
  const { isAuth } = useAppContext();
  const pathname = usePathname();
  return menuItems.map((item) => {
    const isActive = pathname === item.href;

    if (
      (item.authRequired === true && !isAuth) ||
      (item.authRequired === false && isAuth)
    ) {
      return null;
    }

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
