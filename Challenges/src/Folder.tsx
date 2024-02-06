import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { FiFilePlus } from "react-icons/fi";
import { IconContext } from "react-icons";
import { TiFolderAdd } from "react-icons/ti";
import { IoPencilSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

function Folder({ handleInsertNode = () => {}, handleDeleteNode = () => {}, handleRenameNode = () => {},explorer }) {
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false
  });

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder
    });
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleInsertNode(explorer.id, e.target.value, showInput.isFolder);

      setShowInput({ ...showInput, visible: false });
    }
  };

  const onRenameFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleRenameNode(explorer.id, e.target.value);
      setShowInput({ ...showInput, visible: false });
    }
  }

  const handleDeletenode = (folderId) => {
    const finalTree = handleDeleteNode(explorer, folderId);
    setExpand(false);
  }

  const handleRenamenode = (folderId, newName) => {
    const finalTree = handleRenameNode(explorer, folderId, newName);
    setExpand(false);
  }

  const onDeleteNode = (folderId) => {
    const finalTree = handleDeleteNode(explorer, folderId);
    setExpand(false);
  }


  if (explorer.isFolder) {
    return (
        <div style={{ marginTop: 5 }}>
          <div onClick={() => setExpand(!expand)} className="folder">
            <span>📁 {explorer.name}</span>
            <IconContext.Provider value={{ color: "white",className: "global-class-name", size: "1.6em" }}>
              <div>
                <button className="folder-button" onClick={(e) => handleNewFolder(e, true)}><TiFolderAdd /></button>
                <button className="folder-button" onClick={(e) => handleNewFolder(e, false)}><FiFilePlus /></button>
                {/* <button className="folder-button" onClick={(e) => handleRenamenode(explorer.id, e.target.value)}><IoPencilSharp /></button>
                <button className="folder-button" onClick={() => handleDeletenode(explorer.id)}><MdDeleteOutline /></button> */}
              </div>
            </IconContext.Provider>
          </div>

          <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
            {showInput.visible && (
              <div className="inputContainer">
                <span>{showInput.isFolder? "📁" : "📄"}</span> 
                <input
                    type="text"
                    className="inputContainer__input"
                    autoFocus
                    onKeyDown={onAddFolder}
                    onBlur={() => setShowInput({ ...showInput, visible: false })}
                    />
                </div>
            )}

            {explorer.items.map((exp) => {
              return (
                <Folder
                  handleInsertNode={handleInsertNode}
                  key={exp.id}
                  explorer={exp}
                />
              );
            })}
          </div>
        </div>
    );
  } else {
    return <span className="file">📄 {explorer.name}</span>;
  }
}

export default Folder;