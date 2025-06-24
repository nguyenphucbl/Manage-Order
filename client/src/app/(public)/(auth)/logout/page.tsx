"use client";

import { getFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout() {
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

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}
