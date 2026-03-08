import React from "react";
import FolderItem from "./FolderItem";
import { BiNote, BiTimeFive, BiFolder, BiGridVertical, BiLayer } from "react-icons/bi";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const FolderTree = ({ folders, notes, recentNotes, activeNote, onSelectNote, onAddSubNote, onAddSubFolder, onDeleteNote, onRenameFolder, onDeleteFolder, onUpdateFolderColor, searchTerm }) => {
  const rootFolders = folders.filter((f) => !f.parentId);
  const uncategorizedNotes = notes.filter((n) => !n.folderId);
  const filteredNotes = uncategorizedNotes.filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-20 custom-scrollbar">
      {!searchTerm && recentNotes.length > 0 && (
        <div className="mt-2">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 flex items-center gap-2">
            <BiTimeFive size={14} className="text-indigo-400" /> Recent Activity
          </h3>
          <div className="space-y-0.5">
            {recentNotes.map((note) => (
              <button
                key={`recent-${note.id}`}
                onClick={() => onSelectNote(note)}
                className={`flex items-center gap-2.5 w-full p-2 px-3 rounded-lg text-sm transition-all ${activeNote?.id === note.id ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <BiNote className={activeNote?.id === note.id ? "text-indigo-500" : "text-gray-400"} />
                <span className="truncate">{note.title || "Untitled"}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 flex items-center gap-2">
          <BiFolder size={14} className="text-indigo-400" /> Knowledge Tree
        </h3>
        <div className="space-y-1">
          {rootFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              allFolders={folders}
              notes={notes}
              activeNote={activeNote}
              onSelectNote={onSelectNote}
              onAddSubNote={onAddSubNote}
              onAddSubFolder={onAddSubFolder}
              onDeleteNote={onDeleteNote}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              onUpdateFolderColor={onUpdateFolderColor}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Uncategorized</h3>
        <Droppable droppableId="uncategorized" type="NOTE">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-1 min-h-[80px] rounded-xl transition-all border-2 border-transparent flex flex-col ${snapshot.isDraggingOver ? "bg-indigo-50/50 border-dashed border-indigo-200" : ""}`}
            >
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...provided.draggableProps.style }}
                        className={`flex items-center group rounded-lg transition-all ${snapshot.isDragging ? "bg-white shadow-xl ring-2 ring-indigo-500 z-[9999]" : "hover:bg-gray-200"}`}
                      >
                        <div {...provided.dragHandleProps} className="p-2 text-gray-300 cursor-grab hover:text-indigo-500 transition-colors">
                          <BiGridVertical size={18} />
                        </div>
                        <button onClick={() => onSelectNote(note)} className={`flex-1 text-left py-2 pr-4 text-sm truncate ${activeNote?.id === note.id ? "text-indigo-700 font-bold" : "text-gray-600"}`}>
                          <span className="truncate font-medium">{note.title || "Untitled Note"}</span>
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                /* EMPTY STATE UNTUK UNCATEGORIZED */
                <div className="flex-1 flex flex-col items-center justify-center py-6 opacity-20 border-2 border-dashed border-gray-200 rounded-xl m-1">
                  <BiLayer size={32} className="mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-center px-4">Semua catatan sudah rapi di dalam folder</p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default FolderTree;
