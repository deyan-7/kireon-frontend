// MathBlock.ts

import { Node, nodeInputRule, mergeAttributes } from "@tiptap/core";

export interface MathBlockOptions {
  /**
   * Callback to be called when a math block is inserted or parsed.
   */
  onInsert?: (formula: string) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mathBlock: {
      /**
       * Inserts a mathBlock node with the specified formula.
       */
      setMathBlock: (formula: string) => ReturnType;
    };
  }
}

export const MathBlock = Node.create<MathBlockOptions>({
  name: "mathBlock",

  group: "block",

  // Removed 'atom: true' to allow proper block-level behavior
  // atom: true,

  addAttributes() {
    return {
      formula: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-block-math]",
        priority: 1000,
        getAttrs: (el) => {
          const element = el as HTMLElement;
          const formula = element.textContent?.trim() || "";
          return { formula };
        },
      },
      {
        tag: "p",
        priority: 1000,
        getAttrs: (el) => {
          const element = el as HTMLElement;
          const text = element.textContent?.trim() || "";

          const match = text.match(/^\$\$\s*([\s\S]+?)\s*\$\$$/);
          if (match) {
            const formula = match[1].trim();
            if (this.options.onInsert) {
              this.options.onInsert(formula);
            }
            return { formula };
          }

          return false; // Do not parse as MathBlock if no match
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const merged = mergeAttributes(HTMLAttributes, {
      "data-block-math": "true",
    });
    return ["div", merged, node.attrs.formula];
  },

  addCommands() {
    return {
      setMathBlock:
        (formula: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { formula },
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /\$\$\s*([\s\S]+?)\s*\$\$/,
        type: this.type,
        getAttributes: (match) => {
          const formula = match[1].trim();
          if (this.options.onInsert) {
            this.options.onInsert(formula);
          }
          return { formula };
        },
      }),
    ];
  },
});

export default MathBlock;
