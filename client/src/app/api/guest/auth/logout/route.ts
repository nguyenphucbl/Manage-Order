import guestApiRequest from "@/apiRequest/guest";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = await guestApiRequest.sLogout({
      refreshToken,
      accessToken,
    });
    return Response.json(res.payload, { status: res.status });
  } catch (error) {
    return Response.json({ message: "Error server" }, { status: 500 });
  }
}
