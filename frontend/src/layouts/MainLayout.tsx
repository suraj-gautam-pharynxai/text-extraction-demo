import { FooterCard } from "@/components/FooterCard";
import React from "react";
function MainLayout({ children }) {
  return (
    <>
      <main className="px-16 pt-14 border h-full  flex flex-col space-y-6">
        {children}
        <FooterCard />
      </main>
    </>
  );
}

export default MainLayout;
