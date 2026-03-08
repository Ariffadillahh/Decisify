import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { debounce } from "lodash";
import { useMemo } from "react";

const NoteEditor = ({ initialContent, onChange }) => {
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

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
