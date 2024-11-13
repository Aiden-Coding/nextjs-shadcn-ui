import { auth } from "@/auth";
import LogoutBtn from "@/components/auth/logout-button";
export const runtime = "edge";
export default async function DashboardPage() {
  const session = await auth();
  console.log(session);
  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <LogoutBtn />
    </div>
  );
}
