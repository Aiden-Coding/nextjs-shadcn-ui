import { redirect } from "next/navigation";

import { auth } from "@/auth";
export default async function Home() {
  const session = await auth();
  // Navigate to the new post page
  if (session) {
    redirect("/examples/dashboard");
  } else {
    redirect("/login");
  }
}
export const runtime = "edge";
