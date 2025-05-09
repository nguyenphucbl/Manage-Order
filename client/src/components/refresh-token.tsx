"use client";

import { getFromLocalStorage, setToLocalStorage } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
const UNAUTHENTICATED_PATHS = [
  "/login",
  "/register",
  "/logout",
  "/refresh-token",
];
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequest/auth";
export default function RefreshToken() {
  const pathName = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;
    const TIMEOUT = 2000;
    const checkAndRefreshToken = async () => {
      const accessToken = getFromLocalStorage("accessToken");
      const refreshToken = getFromLocalStorage("refreshToken");
      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedRefreshToken.exp < currentTime) {
        clearInterval(interval);
        return;
      }
      // Check if the access token have 1/3 of its lifetime left
      const tokenLifetime = decodedAccessToken.exp - decodedAccessToken.iat;
      const remainingTime = decodedAccessToken.exp - currentTime;

      if (remainingTime < tokenLifetime / 3) {
        try {
          const res = await authApiRequest.refreshToken();
          if (res?.status === 200) {
            const { accessToken, refreshToken } = res.payload.data;
            setToLocalStorage("accessToken", accessToken);
            setToLocalStorage("refreshToken", refreshToken);
          }
        } catch (error) {
          clearInterval(interval);
        }
      }
    };
    // Kiểm tra lần đầu sau một khoảng thời gian ngắn
    const initialTimeout = setTimeout(() => {
      checkAndRefreshToken();
    }, 1000);
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [pathName]);
  return null;
}
