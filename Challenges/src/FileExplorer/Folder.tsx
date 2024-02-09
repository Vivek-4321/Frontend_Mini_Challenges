import { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { FiFilePlus } from "react-icons/fi";
import { IconContext } from "react-icons";
import { TiFolderAdd } from "react-icons/ti";
import { IoPencilSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

function Folder({ handleInsertNode = () => {}, handleDeleteNode = () => {}, handleRenameNode = () => {},explorer }) {
  const [expand, setExpand] = useState(false);
  const [rename, setRename] = useState(false);
  const [newName, setNewName] = useState('');
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
      setShowInput({ ...showInput, visible: true });
      setRename(false);
    }
  }

  const handleDeletenode = (e,folderId) => {
    e.stopPropagation();
    handleDeleteNode(folderId);
  };

  const handleRenamenode = (folderId, newName) => {
    const finalTree = handleRenameNode(explorer, folderId, newName);
    setExpand(false);
  }


  if (explorer.isFolder) {
    return (
        <div style={{ marginTop: 5 }}>
          <div onClick={() => setExpand(!expand)} className="folder">
            {rename && (
  <div className="inputContainer">📁 
    <input
      type="text"
      defaultValue={explorer.name}
      autoFocus
      onChange={(e) => setNewName(e.target.value)}
      onKeyDown={onRenameFolder}
      onBlur={() => setShowInput({ ...showInput, visible: false })}
      className="inputContainer__input__folder"
    />
  </div>
)}
{!rename && <span>📁 {explorer.name}</span>}
            <IconContext.Provider value={{ color: "white",className: "global-class-name", size: "1.6em" }}>
              <div>
                <button className="folder-button" onClick={(e) => handleNewFolder(e, true)}><TiFolderAdd /></button>
                <button className="folder-button" onClick={(e) => handleNewFolder(e, false)}><FiFilePlus /></button>
                <button className="folder-button" onClick={(e) => {setRename(!rename)}}><IoPencilSharp /></button>
                <button className="folder-button" onClick={(e) => handleDeletenode(e,explorer.id)}><MdDeleteOutline /></button>
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
                  handleDeleteNode={handleDeleteNode}
                  handleRenameNode={handleRenameNode}
                  key={exp.id}
                  explorer={exp}
                />
              );
            })}
          </div>
        </div>
    );
  } else {
    return ( 
      
      <div className="file__page">
            {rename && (
  <div className="inputContainer">📄
    <input
      type="text"
      defaultValue={explorer.name}
      autoFocus
      onChange={(e) => setNewName(e.target.value)}
      onKeyDown={onRenameFolder}
      onBlur={() => setShowInput({ ...showInput, visible: false })}
      className="inputContainer__input"
    />
  </div>
)}
{!rename && <span className="file">📄 {explorer.name}</span>}
            <div className="file__page__icon">
            <IconContext.Provider value={{ color: "white",className: "global-class-name", size: "1.6em" }}>
                <button className="folder-button__page" onClick={() => {setRename(!rename)}}><IoPencilSharp /></button>
                <button className="folder-button__page" onClick={(e) => handleDeletenode(e,explorer.id)}><MdDeleteOutline /></button>
            </IconContext.Provider>
            </div>
      </div>
      
    );
  }
}

export default Folder;

