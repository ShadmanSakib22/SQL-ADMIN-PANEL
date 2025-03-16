import Link from "next/link";

export function Navbar() {
  return (
    <nav className="py-4 px-4 text-xs md:text-sm text-[#fbe5b9] bg-[#412413] flex justify-between items-center">
      <Link href={"/"} className="text-lg md:text-xl font-bold">
        Admin Panel
      </Link>

      <div className="flex gap-2 md:gap-4">
        <Link
          href={"/signup"}
          className="px-4 py-2 min-w-[92px] text-center rounded-md bg-[#fbe5b9] text-[#412413] hover:bg-[#f8d88d] transition-colors"
        >
          Register
        </Link>
        <Link
          href={"/login"}
          className="px-4 py-2 min-w-[92px] text-center rounded-md border border-[#fbe5b9] hover:bg-[#523016] transition-colors"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
