import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { debounce } from "lodash";
import { useMemo, useEffect } from "react"; // Tambahkan useEffect

const NoteEditor = ({ initialContent, onChange }) => {
  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  // --- LOGIC: Sinkronisasi Manual ---
  useEffect(() => {
    if (editor && initialContent) {
      // Ambil konten editor saat ini untuk dibandingkan
      const currentContent = JSON.stringify(editor.document);

      // Jika konten di database (initialContent) berbeda dengan di layar
      // Ini biasanya terpicu saat AI baru saja melakukan 'insert'
      if (currentContent !== initialContent) {
        try {
          const parsed = JSON.parse(initialContent);

          // Ganti semua block yang ada dengan data yang baru
          // replaceBlocks(targetBlocks, newBlocks)
          editor.replaceBlocks(editor.document, parsed);
        } catch (e) {
          console.error("Gagal sinkronisasi data AI ke editor:", e);
        }
      }
    }
  }, [initialContent, editor]); // Berjalan tiap kali initialContent berubah

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
