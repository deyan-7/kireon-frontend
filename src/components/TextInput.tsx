"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import styles from "./TextInput.module.scss";

type TextInputProps = {
  inputEnabled: boolean;
  placeholder?: string;
  onSubmit: (text: string) => void;
};

export type TextInputRef = {
  focusInput: () => void;
};

const TextInput = forwardRef<TextInputRef, TextInputProps>(
  ({ inputEnabled, placeholder, onSubmit }, ref) => {
    const [typedText, setTypedText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const t = useTranslations();

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        textareaRef.current?.focus();
      },
    }));

    useEffect(() => {
      requestAnimationFrame(() => adjustHeight());
    });

    const submitMessage = () => {
      onSubmit(typedText);
      setTypedText("");
      requestAnimationFrame(() => adjustHeight());

      if (
        typeof window !== "undefined" &&
        window.mobileLayoutControls?.isMobile
      ) {
        window.mobileLayoutControls.collapseLeftPane();
      }
    };

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.overflowY = "hidden";
      const lineHeight =
        parseFloat(getComputedStyle(textarea).lineHeight) || 30;
      const maxHeight = lineHeight * 4;
      textarea.style.height = textarea.scrollHeight + "px";
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = maxHeight + "px";
        textarea.style.overflowY = "auto";
      }
    };

    const handleFocus = () => {
      if (
        typeof window !== "undefined" &&
        window.mobileLayoutControls?.isMobile
      ) {
        window.mobileLayoutControls.expandLeftPane();
      }
    };

    return (
      <div className={`relative ${styles.textareaWrapper}`}>
        <textarea
          ref={textareaRef}
          className="rounded-xl relative min-w-64"
          name="chatInput"
          placeholder={placeholder || t("input_placeholder")}
          aria-disabled={!inputEnabled}
          disabled={!inputEnabled}
          required
          value={typedText}
          onChange={(e) => {
            setTypedText(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submitMessage();
            }
          }}
          onFocus={handleFocus}
          rows={1}
          style={{
            lineHeight: "2em",
            maxHeight: "7em",
            overflow: "hidden",
          }}
        />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            submitMessage();
          }}
        >
          <Image
            alt=""
            width="21"
            height="21"
            src="/assets/images/icon_paperplane.svg"
            className="absolute bottom-[1.1rem] right-4"
          />
        </a>
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
