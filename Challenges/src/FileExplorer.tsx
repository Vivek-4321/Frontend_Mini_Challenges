import { useState } from 'react';
import './FileExplorer.css';
import explorer from './assets/FolderData.js';
import Folder from './Folder.js';
import useTraverseTree from './useTraverseTree.js';

function FileExplorer() {
  
    const [explorerData, setExplorerData] = useState(explorer)
  
    const { insertNode } = useTraverseTree();

    const handleInsertNode = (folderId, item, isFolder) => {
      const finalTree = insertNode(explorerData, folderId, item, isFolder);
      setExplorerData(finalTree);
    }

    return (
    <>
        <Folder handleInsertNode={handleInsertNode} explorer={explorerData}/>
    </>
  )
}

export default FileExplorer;