"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
const UNAUTHENTICATED_PATHS = [
  "/login",
  "/register",
  "/logout",
  "/refresh-token",
];
export default function RefreshToken() {
  const pathName = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;
    const TIMEOUT = 2000;

    // Kiểm tra lần đầu sau một khoảng thời gian ngắn
    const initialTimeout = setTimeout(() => {
      checkAndRefreshToken({
        onError: () => {
          clearTimeout(initialTimeout);
          clearInterval(interval);
        },
      });
    }, 1000);
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearTimeout(initialTimeout);
          clearInterval(interval);
          router.push("/login");
        },
      });
    }, TIMEOUT);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [pathName, router]);
  return null;
}
