import { auth } from "@/auth";
import LogoutBtn from "@/components/auth/logout-button";

const AdminPage = async () => {
  const session = await auth();

  console.log(session);

  if (session?.user?.role !== "admin") {
    return <div>You are not admin</div>;
  }

  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <LogoutBtn />
    </div>
  );
};
export default AdminPage;
