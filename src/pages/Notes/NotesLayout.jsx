import MainLayouts from "../MainLayouts";
import { BiPlus, BiFolderPlus } from "react-icons/bi";

const NotesLayout = ({ children, onCreateNote, onCreateFolder }) => {
  return (
    <MainLayouts>
      <div className="flex flex-col h-screen bg-white mx-5 ml-10">
        <nav className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-600">Notes</h1>
            <div className="flex gap-2">
              <button onClick={onCreateFolder} className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200" title="New Folder">
                <BiFolderPlus size={20} className="text-gray-600" />
              </button>
              <button onClick={onCreateNote} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">
                <BiPlus /> New Note
              </button>
            </div>
          </div>
        </nav>

        <div className="flex flex-1 overflow-hidden">{children}</div>
      </div>
    </MainLayouts>
  );
};

export default NotesLayout;
