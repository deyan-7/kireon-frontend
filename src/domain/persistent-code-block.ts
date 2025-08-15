import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";

export const PersistentCodeBlock = Extension.create({
  name: "persistentCodeBlock",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("persistentCodeBlock"),
        appendTransaction: (transactions, oldState, newState) => {
          const { doc } = newState;

          // if doc has no codeBlock anymore
          if (
            doc.childCount !== 1 ||
            doc.firstChild?.type.name !== "codeBlock"
          ) {
            const tr = newState.tr;

            const emptyCodeBlock = newState.schema.nodes.codeBlock.create(
              doc.firstChild?.attrs ?? {},
              []
            );

            tr.replaceWith(0, doc.content.size, emptyCodeBlock);

            tr.setSelection(TextSelection.create(tr.doc, 1));

            return tr;
          }

          return null;
        },
      }),
    ];
  },
});
