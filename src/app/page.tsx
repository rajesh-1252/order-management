"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/order");
  }, [router]);

  return (
    <div className="center h-screen">Redirecting...</div>
  );
};

export default Page;
