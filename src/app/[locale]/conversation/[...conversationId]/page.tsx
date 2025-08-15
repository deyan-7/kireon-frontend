"use client";

import ConversationChat from "@/components/ConversationChat";
import Protected from "@/components/Protected";

const ConversationsPage: React.FC = () => {
  return (
    <Protected>
      <ConversationChat />
    </Protected>
  );
};

export default ConversationsPage;
