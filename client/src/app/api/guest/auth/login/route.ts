import guestApiRequest from "@/apiRequest/guest";
import { HttpError } from "@/lib/http";
import { GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  const res = (await request.json()) as GuestLoginBodyType;
  const cookieStore = cookies();
  try {
    const { payload } = await guestApiRequest.sLogin(res);
    const { accessToken, refreshToken } = payload.data;
    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      expires: decodedAccessToken.exp * 1000,
      sameSite: "lax",
      path: "/",
      secure: true,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      expires: decodedRefreshToken.exp * 1000,
      sameSite: "lax",
      secure: true,
      path: "/",
    });
    return Response.json(payload, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    }
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
