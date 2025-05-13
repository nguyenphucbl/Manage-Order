/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormSetError } from "react-hook-form";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequest/auth";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.replace(/^\/+/, "");
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((err) => {
      setError(err.field, {
        type: "server",
        message: err.message,
      });
    });
  } else {
    toast.error("Có lỗi xảy ra", {
      description: error.message,
      duration: duration || 2000,
      action: {
        label: "Đóng",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  }
};
const isBrowser = typeof window !== "undefined";
export const getFromLocalStorage = (key: string) => {
  if (!isBrowser) return null;
  const value = localStorage.getItem(key);
  if (!value) return null;
  return value;
};
export const setToLocalStorage = (key: string, value: string) => {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
};
export const removeFromLocalStorage = (key: string) => {
  if (!isBrowser) return;
  localStorage.removeItem(key);
};
export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
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
    // Refresh token expired
    removeFromLocalStorage("accessToken");
    removeFromLocalStorage("refreshToken");
    if (param?.onError) param.onError();
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
      if (param?.onSuccess) param.onSuccess();
    } catch (error) {
      if (param?.onError) param.onError();
    }
  }
};
