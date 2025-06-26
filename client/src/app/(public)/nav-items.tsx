"use client";

import { useAppContext } from "@/components/app-provider";
import { cn } from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Trang chủ",
    href: "/",
    visibility: "Public",
  },
  {
    title: "Món ăn",
    href: "/menu",
    visibility: "Public",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    visibility: "Authenticated",
  },
  {
    title: "Đăng nhập",
    href: "/login",
    visibility: "Guest",
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    visibility: "Owner",
  },
];
const shouldShowItem = (item: (typeof menuItems)[0], role?: RoleType) => {
  switch (item.visibility) {
    case "Public":
      return true;
    case "Authenticated":
      return !!role;
    case "Guest":
      return !role;
    case "Owner":
      return role === "Owner";
  }
};
export default function NavItems({ className }: { className?: string }) {
  const { role } = useAppContext();
  const pathname = usePathname();
  return menuItems.map((item) => {
    const isActive = pathname === item.href;

    // if (
    //   (item.authRequired === true && !role) ||
    //   (item.authRequired === false && role) ||
    //   (item.authRequired === true && role !== "Owner")
    // ) {
    //   return null;
    // }
    if (!shouldShowItem(item, role)) return null;
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
