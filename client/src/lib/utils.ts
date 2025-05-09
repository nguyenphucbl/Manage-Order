/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormSetError } from "react-hook-form";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";

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
