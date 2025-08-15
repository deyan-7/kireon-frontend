import { Extension } from "@tiptap/core";
import { keymap } from "prosemirror-keymap";
import { EditorState, Transaction } from "prosemirror-state";

export const CodeBlockNewlineFix = Extension.create({
  name: "codeBlockNewlineFix",

  addProseMirrorPlugins() {
    return [
      keymap({
        Enter(
          state: EditorState,
          dispatch?: (tr: Transaction) => void
        ): boolean {
          const { $head } = state.selection;
          if ($head.parent.type.name === "codeBlock") {
            if (dispatch) {
              dispatch(state.tr.insertText("\n"));
            }
            return true;
          }
          return false;
        },
        "Shift-Enter"(
          state: EditorState,
          dispatch?: (tr: Transaction) => void
        ): boolean {
          const { $head } = state.selection;
          if ($head.parent.type.name === "codeBlock") {
            if (dispatch) {
              dispatch(state.tr.insertText("\n"));
            }
            return true;
          }
          return false;
        },
      }),
    ];
  },
});
