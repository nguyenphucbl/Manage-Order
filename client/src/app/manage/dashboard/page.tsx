import accountApiRequest from "@/apiRequest/account";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  let name: string = "";
  try {
    const res = await accountApiRequest.sMe(accessToken);
    name = res.payload.data.name;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.digest.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }

  return <div>Hello {name} </div>;
}
