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
      const uiElements: any[] = [];
      const formData: Record<string, any> = {};

      for (const field of payloadArray) {
        // Unpack all potential properties from the backend payload
        const { key, type, title, enum: enumVals, uischema, data, format } = field;

        if (!key) continue;

        // Build the schema property for this field
        properties[key] = {
          type,
          title,
          // FIX: Include the 'format' property if it exists (for date-pickers)
          ...(format && { format }),
          ...(enumVals && { enum: enumVals }),
        };

        // Build the UI schema element for this field
        if (uischema) {
          uiElements.push({
            type: "Control",
            scope: `#/properties/${key}`,
            // FIX: Pass through all options from the backend directly
            // This allows for things like multi-line text areas, radios, etc.
            ...(uischema.options && { options: uischema.options }),
          });
        }

        // Set the initial form data for this field
        formData[key] = data ?? "";
      }

      return {
        schema: {
          type: "object",
          properties,
        },
        uischema: {
          type: "Group",
          elements: uiElements,
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
