/* eslint-disable @typescript-eslint/no-explicit-any */

import { redirect } from "next/navigation";
import { normalizePath } from "./utils";
import { LoginResType } from "@/schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Lỗi Http",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}
export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload, message: "Lỗi Entity" });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;

export const isClient = typeof window !== "undefined";

//NOTE Tách xử lý lỗi thành hàm riêng biệt
const handleResponseError = async (
  res: Response,
  data: any,
  baseHeaders: HeadersInit,
  options?: CustomOptions
): Promise<never> => {
  if (res.status === ENTITY_ERROR_STATUS) {
    throw new EntityError(
      data as {
        status: typeof ENTITY_ERROR_STATUS;
        payload: EntityErrorPayload;
      }
    );
  }
  if (res.status === AUTHENTICATION_ERROR_STATUS) {
    await handleAuthenticationError(baseHeaders, options);
  }
  throw new HttpError(data);
};

//NOTE Xử lý lỗi xác thực
const handleAuthenticationError = async (
  baseHeaders: HeadersInit,
  options?: CustomOptions
): Promise<void> => {
  if (isClient) {
    if (!clientLogoutRequest) {
      clientLogoutRequest = fetch("/api/auth/logout", {
        method: "POST",
        body: null,
        headers: baseHeaders,
      });
    }
    try {
      await clientLogoutRequest;
    } catch (error) {
      console.log("error");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clientLogoutRequest = null;
      location.href = "/login";
    }
  } else {
    const accessToken = (options?.headers as any)?.Authorization.split(" ")[1];
    if (accessToken) {
      redirect(`logout?accessToken=${accessToken}`);
    } else {
      redirect("/login");
    }
  }
};

//NOTE Xử lý storage khi login/logout
const handleStorage = (url: string, payload: any): void => {
  if (!isClient) return;
  const normalizeUrl = normalizePath(url);
  if (normalizeUrl === "api/auth/login") {
    try {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }
    } catch (error) {
      console.log("Failed to store auth tokens", error);
    }
  } else if (normalizeUrl === "api/auth/logout") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

//NOTE Xử lý request
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: HeadersInit =
    body instanceof FormData ? {} : { "Content-Type": "application/json" };

  // Thêm token xác thực nếu đang ở client-side
  if (isClient) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  const baseUrl = options?.baseUrl ?? process.env.NEXT_PUBLIC_API_ENDPOINT;
  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    method,
    body,
  });

  // Xử lý response
  let payload: Response;
  try {
    payload = await res.json();
  } catch (error) {
    // Nếu không thể parse JSON, có thể là lỗi không xác định
    // Hoặc lỗi không phải JSON (như HTML, văn bản thuần túy, v.v.)
    if (res.ok) {
      payload = {} as Response;
    } else {
      throw new HttpError({
        status: res.status,
        payload: { message: "Lỗi không xác định" },
      });
    }
  }
  const data = { status: res.status, payload };
  // Xử lý lỗi nếu response không ok
  if (!res.ok) {
    await handleResponseError(res, data, baseHeaders, options);
  }
  // Xử lý local storage nếu ở client-side (login/logout)
  handleStorage(url, payload);
  // Trả về payload nếu response ok
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, options);
  },
};

export default http;
