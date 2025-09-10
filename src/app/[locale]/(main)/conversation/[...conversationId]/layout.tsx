import SplitView from "@/components/SplitView";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SplitView>{children}</SplitView>;
}
