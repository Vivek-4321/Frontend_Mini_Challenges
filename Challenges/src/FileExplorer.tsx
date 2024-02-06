import { useState } from 'react';
import './FileExplorer.css';
import explorer from './assets/FolderData.js';
import Folder from './Folder.js';
import useTraverseTree from './useTraverseTree.js';

function FileExplorer() {
  
    const [explorerData, setExplorerData] = useState(explorer)
  
    const { insertNode, deleteNode, renameNode } = useTraverseTree();

    const handleDeleteNode = (folderId) => {
      const finalTree = deleteNode(explorerData, folderId);
      setExplorerData(finalTree);
    }

    const handleRenameNode = (folderId, newName) => {
      const finalTree = renameNode(explorerData, folderId, newName);
      setExplorerData(finalTree);
    }

    const handleInsertNode = (folderId, item, isFolder) => {
      const finalTree = insertNode(explorerData, folderId, item, isFolder);
      setExplorerData(finalTree);
    }

    return (
    <>  <div className='file_explorer__wrapper'>
          <h2 className='file_explorer__title'>File Explorer</h2>
          <Folder handleInsertNode={handleInsertNode} handleDeleteNode={handleDeleteNode} handleRenameNode={handleRenameNode} explorer={explorerData}/>
        </div>
    </>
  )
}

export default FileExplorer;