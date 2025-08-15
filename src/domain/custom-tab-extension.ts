import { Extension } from '@tiptap/core'

const TAB_CHAR = '\u0009';

export const CustomTabExtension = Extension.create({
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        // Using the Tiptap chain/command API
        this.editor
          .chain()
          // If you also want to indent list items (optional):
          .sinkListItem('listItem')
          .command(({ tr }) => {
            // Insert 4 spaces at the current cursor position
            tr.insertText(TAB_CHAR)
            return true
          })
          .run()

        // Return true to stop the default behavior
        return true
      },
    }
  },
})