"use client";

import { formatMarkdownHtml } from "@/domain/markdown-service";

type Props = {
  artifact: any;
};

const ArtifactTaskInstruction = ({ artifact }: Props) => {
  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-grow markdown-chat"
        dangerouslySetInnerHTML={{
          __html: formatMarkdownHtml(artifact.content ?? ""),
        }}
      />
    </div>
  );
};

export default ArtifactTaskInstruction;
