import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UsersTable from "@/components/UsersTable";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/page/login");
  }

  return (
    <>
      <div className="container mx-auto py-[5rem]">
        <h3 className="text-2xl font-bold mb-[2rem]">
          Welcome, {session.user.name}!
        </h3>
        <div className="bg-white border-4 border-double border-gray-200 shadow-md rounded-lg p-4 lg:p-8">
          <UsersTable />
        </div>
      </div>
    </>
  );
}
