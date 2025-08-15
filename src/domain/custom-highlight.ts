import { Mark } from '@tiptap/core';
import { EditorState, Transaction } from 'prosemirror-state';
import {
  Mark as ProseMirrorMark,
  Node as ProseMirrorNode,
} from 'prosemirror-model';

export interface CustomExtensionOptions {
  multicolor: boolean;
  onHighlight?: (selectedText: string) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customExtension: {
      /**
       * Comments will be added to the autocomplete.
       */
      unsetAllHighlights: (someProp: unknown) => ReturnType;
      customHighlight: (color: string) => ReturnType;
    };
  }
}

const CustomHighlight = Mark.create<CustomExtensionOptions>({
  name: 'customHighlight',

  addOptions() {
    return {
      multicolor: false, // Optional: Add multicolor support like the Highlight extension
    };
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-color'),
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }

          return {
            'data-color': attributes.color,
            style: `background-color: ${attributes.color};`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-color]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0];
  },

  addCommands() {
    return {
      customHighlight:
        (color: string) =>
        ({ commands, editor }) => {
          const { from, to } = editor.state.selection;
          const selectedText = editor.state.doc.textBetween(from, to, ' ');

          // Dispatch the selected text for external handling
          if (this.options.onHighlight) {
            this.options.onHighlight(selectedText); // Pass the selected text to the Vue component
          }

          return commands.setMark(this.name, { color });
        },
      unsetAllHighlights:
        () =>
        ({
          state,
          dispatch,
        }: {
          state: EditorState;
          dispatch: ((tr: Transaction) => void) | undefined;
        }) => {
          const { doc, tr } = state; // Access the document and transaction

          // Traverse the document and remove all customHighlight marks
          doc.descendants((node: ProseMirrorNode, pos: number) => {
            if (node.isText && node.marks.length) {
              node.marks.forEach((mark: ProseMirrorMark) => {
                if (mark.type.name === 'customHighlight') {
                  tr.removeMark(pos, pos + node.nodeSize, mark.type);
                }
              });
            }
          });

          // Apply the transaction if any changes were made
          if (dispatch) {
            dispatch(tr);
            return true;
          }

          return false;
        },
    };
  },
});

export default CustomHighlight;
