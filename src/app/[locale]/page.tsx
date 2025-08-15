"use client";

import Protected from "@/components/Protected";
import StartGuest from "@/components/StartGuest";

const StartGuestPage: React.FC = () => {
  return (
    <Protected>
      <StartGuest />
    </Protected>
  );
};

export default StartGuestPage;
