import { RegistrationForm } from "@/components/RegistrationForm";
import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="container flex flex-col lg:flex-row mx-auto items-center gap-8 mt-[5rem]">
        <Image src="/login.jpg" alt="login" width={720} height={720} priority />
        <div className="w-full max-w-lg mx-auto">
          <RegistrationForm />
        </div>
      </div>
    </>
  );
};

export default page;
