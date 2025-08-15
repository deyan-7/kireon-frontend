"use client";

import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";

import { JsonForms } from "@jsonforms/react";
import { vanillaRenderers, vanillaCells } from "@jsonforms/vanilla-renderers";
import { formatMarkdownHtml } from "@/domain/markdown-service";

type Props = {
  artifact: any;
  onModified: (val: any) => void;
};

export type ArtifactFormRef = {
  getUpdatedArtifact: () => any;
};

const ArtifactForm = forwardRef<ArtifactFormRef, Props>(
  ({ artifact, onModified }, ref) => {
    const stableString = useMemo(() => {
      return typeof artifact.content === "string"
        ? artifact.content
        : JSON.stringify(artifact.content ?? {});
    }, [artifact.content]);

    const parsedContent = useMemo(() => {
      try {
        return JSON.parse(stableString);
      } catch {
        return {};
      }
    }, [stableString]);

    const payloadArray = parsedContent.payload;
    const markdown = parsedContent.content ?? "";

    const { schema, uischema, initialData } = useMemo(() => {
      if (!Array.isArray(payloadArray)) {
        return {
          schema: { type: "object", properties: {} },
          uischema: { type: "Group", elements: [] },
          initialData: {},
        };
      }

      const properties: Record<string, any> = {};
      const ui: Record<string, any> = {};
      const formData: Record<string, any> = {};

      for (const field of payloadArray) {
        const { key, type, title, enum: enumVals, uischema, data } = field;

        if (!key) continue;

        properties[key] = {
          type,
          title,
          ...(enumVals ? { enum: enumVals } : {}),
        };

        if (uischema) {
          ui[key] = {
            type: "Control",
            scope: `#/properties/${key}`,
            options: {
              format:
                field.uischema?.["ui:widget"] === "radio" ? "radio" : undefined,
            },
          };
        }

        formData[key] = data ?? "";
      }

      return {
        schema: {
          type: "object",
          properties,
        },
        uischema: {
          type: "Group",
          elements: Object.entries(ui).map(([key, schema]) => ({
            scope: `#/properties/${key}`,
            ...schema,
          })),
        },
        initialData: formData,
      };
    }, [payloadArray]);

    const [formData, setFormData] = useState(initialData);
    const originalData = useRef(JSON.stringify(initialData));

    const buildUpdatedArtifact = (): any => ({
      ...artifact,
      payload: {
        schema,
        uischema,
        data: formData,
      },
      version: (artifact.version ?? 0) + 1,
    });

    useImperativeHandle(ref, () => ({
      getUpdatedArtifact: () => buildUpdatedArtifact(),
    }));

    useEffect(() => {
      const isModified = JSON.stringify(formData) !== originalData.current;
      if (isModified) {
        onModified(buildUpdatedArtifact());
      } else {
        onModified(null);
      }
    }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      setFormData(initialData);
      originalData.current = JSON.stringify(initialData);
    }, [initialData]);

    const handleChange = ({ data }: { data: Record<string, unknown> }) => {
      setFormData(data);
    };

    return (
      <div className="flex-grow overflow-y-auto">
        {markdown && (
          <div
            className="markdown-chat mb-10"
            dangerouslySetInnerHTML={{
              __html: formatMarkdownHtml(markdown),
            }}
          />
        )}

        <JsonForms
          data={formData}
          schema={schema}
          uischema={uischema}
          cells={vanillaCells}
          renderers={vanillaRenderers}
          onChange={handleChange}
          config={{ validationMode: "NoValidation", useDefaults: true }}
        />
      </div>
    );
  }
);

ArtifactForm.displayName = "ArtifactForm";
export default ArtifactForm;
