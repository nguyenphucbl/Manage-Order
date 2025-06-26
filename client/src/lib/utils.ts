/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormSetError } from "react-hook-form";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequest/auth";
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import { TokenPayload } from "@/types/jwt.types";
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
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);

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

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
