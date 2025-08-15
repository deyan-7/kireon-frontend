"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import BubbleCanvas from "@/components/BubbleCanvas";
import LegalLinks from "@/components/LegalLinks";

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <BubbleCanvas />

      <div className="flex flex-col relative z-10 gap-20 justify-center h-screen w-screen overflow-hidden">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div>
            <Image
              src="/assets/images/ava_logo.svg"
              alt="Logo"
              width={90}
              height={90}
              className="w-[90px]"
              priority
            />
          </div>
          <span className="ava_title">AI Competence Test</span>
        </div>

        <main className="flex justify-center">
          <div className="box_blue_wrapper">
            <div className="box_blue p-8">{children}</div>
          </div>
        </main>

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <LegalLinks />
        </div>
      </div>

      <style jsx>{`
        .icon_agent {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default BaseLayout;
