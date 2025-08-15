"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common } from "lowlight";

import { formatHtmlMarkdown } from "@/domain/markdown-service";
import CustomHighlight from "@/domain/custom-highlight";
import MathBlock from "@/domain/custom-math-block";
import { CustomTabExtension } from "@/domain/custom-tab-extension";
import { PersistentCodeBlock } from "@/domain/persistent-code-block";
import { CodeBlockNewlineFix } from "@/domain/custom-keymaping";

type Props = {
  artifact: any;
  versions: any[];
  onModified: (updatedArtifact: any) => void;
};

const lowlight = createLowlight(common);

const ArtifactEditor = ({ artifact, onModified }: Props) => {
  const originalMarkdown =
    typeof artifact.payload === "string"
      ? artifact.payload
      : artifact.content?.artifact_content ??
        artifact.content?.task_content?.content ??
        "";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ hardBreak: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      PersistentCodeBlock,
      TableCell,
      CodeBlockLowlight.configure({ lowlight }),
      MathBlock,
      CustomHighlight,
      CustomTabExtension,
      Image,
      Link,
      CodeBlockNewlineFix,
    ],
    content: artifact.isCodeBlock
      ? {
          type: "doc",
          content: [
            {
              type: "codeBlock",
              attrs: { language: artifact.language || "" },
              content: [{ type: "text", text: originalMarkdown.trim() }],
            },
          ],
        }
      : originalMarkdown,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const currentMarkdown = formatHtmlMarkdown(html).trim();
      onModified({
        ...artifact,
        content: currentMarkdown,
        version: (artifact.version ?? 0) + 1,
      });
    },
  });

  return (
    <div className="flex-grow markdown-chat">
      <EditorContent editor={editor} />
    </div>
  );
};

export default ArtifactEditor;
