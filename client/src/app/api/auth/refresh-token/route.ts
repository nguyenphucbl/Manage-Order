import authApiRequest from "@/apiRequest/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  if (!refreshToken) {
    return Response.json(
      { message: "Refresh token not found" },
      { status: 401 }
    );
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = payload.data;
    const decodedAccessToken = jwt.decode(accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(newRefreshToken) as {
      exp: number;
    };
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      expires: decodedAccessToken.exp * 1000,
      sameSite: "lax",
      path: "/",
      secure: true,
    });
    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      expires: decodedRefreshToken.exp * 1000,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
    return Response.json(payload, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      { message: error.message ?? "Error" },
      { status: 401 }
    );
  }
}
