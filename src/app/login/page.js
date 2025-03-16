import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="my-[5rem] container min-w-[330px] max-w-[380px] mx-auto ">
          <LoginForm />
        </div>
        <figure className="hidden md:block relative md:w-2/3 h-full bg-[#f9e1b3] border-l-4 border-double overflow-hidden">
          <Image
            src="/login.jpg"
            alt="login"
            fill
            priority
            className="object-contain object-center max-h-[600px] max-w-[600px] mx-auto"
          />
        </figure>
      </div>
    </>
  );
};

export default page;
