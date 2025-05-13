"use client";

import { getFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef(false);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  useEffect(() => {
    if (
      (ref.current &&
        refreshTokenFromUrl &&
        refreshTokenFromUrl !== getFromLocalStorage("refreshToken")) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getFromLocalStorage("accessToken"))
    )
      return router.push("/");

    ref.current = true;
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = false;
      }, 1000);

      window.location.href = "/login";
    });
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);
  return <div>Logout...</div>;
}
