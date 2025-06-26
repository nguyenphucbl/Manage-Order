"use client";

import { useAppContext } from "@/components/app-provider";
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
  const { setRole } = useAppContext();
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
      setRole(undefined);
      window.location.href = "/login";
    });
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole]);
  return <div>Logout...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}
