import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { debounce } from "lodash";
import { useMemo, useEffect } from "react";

const NoteEditor = ({ initialContent, onChange }) => {
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  useEffect(() => {
    if (editor && initialContent) {
      const currentContent = JSON.stringify(editor.document);

      if (currentContent !== initialContent) {
        try {
          const parsed = JSON.parse(initialContent);

          editor.replaceBlocks(editor.document, parsed);
        } catch (e) {
          console.error("Gagal sinkronisasi data AI ke editor:", e);
        }
      }
    }
  }, [initialContent, editor]); 

  const debouncedUpdates = useMemo(() => debounce((content) => onChange(content), 1000), [onChange]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={() => {
          const content = JSON.stringify(editor.document);
          debouncedUpdates(content);
        }}
      />
    </div>
  );
};

export default NoteEditor;
