import accountApiRequest from "@/apiRequest/account";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const result = await accountApiRequest.sMe(accessToken);
  console.log(result.payload.data);

  return <div>Dashboard</div>;
}
