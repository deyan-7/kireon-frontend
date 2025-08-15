"use client";

import {
  formatMarkdownHtml,
  splitMarkdownIntoChunks,
} from "@/domain/markdown-service";
import ArtifactEditor from "./ArtifactEditor";

type Props = {
  artifact: any;
  onModified: (updatedArtifact: any) => void;
};

const ArtifactMarkdown = ({ artifact, onModified }: Props) => {
  const markdown =
    typeof artifact.payload === "string"
      ? artifact.payload
      : artifact.content?.artifact_content ??
        artifact.content?.task_content?.content ??
        "";

  const chunks = splitMarkdownIntoChunks(markdown);

  return (
    <div className="flex-grow space-y-4">
      {chunks.map((chunk, index) =>
        chunk.type === "markdown" ? (
          <div
            key={index}
            className="markdown-chat"
            dangerouslySetInnerHTML={{
              __html: formatMarkdownHtml(chunk.content),
            }}
          />
        ) : (
          <ArtifactEditor
            key={index}
            artifact={{
              ...artifact,
              payload: chunk.content,
              isCodeBlock: true,
              language: chunk.language,
            }}
            versions={[]}
            onModified={onModified}
          />
        )
      )}
    </div>
  );
};

export default ArtifactMarkdown;
