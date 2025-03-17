import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/page/login");
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-4">
          Welcome, {session.user.name} to the SQL Admin Panel
        </h3>
        {/* Table */}
        {/* Pagination */}
      </div>
    </>
  );
}
