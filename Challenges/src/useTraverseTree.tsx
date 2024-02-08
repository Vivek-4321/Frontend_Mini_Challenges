const useTraverseTree = () => {

    const insertNode = function (tree, folderId, item, isFolder) {
      if (tree.id === folderId && tree.isFolder) {
        tree.items.unshift({
          id:new Date().getTime(),
          name: item,
          isFolder: isFolder,
          items: []
        });
  
        return tree;
      }
  
      let latestNode = [];
      latestNode = tree.items.map((ob) => {
        return insertNode(ob, folderId, item, isFolder);
      });
  
      return { ...tree, items: latestNode };
    };
  
    const deleteNode = (tree, folderId) => {
      if (tree.id === folderId) {
        // If this is the node to delete, simply return undefined or null
        return null;
      }
    
      // Map over the items and recursively call deleteNode on each
      const updatedItems = tree.items.map(item => deleteNode(item, folderId));
    
      // Filter out any null values (which represent deleted nodes)
      const filteredItems = updatedItems.filter(Boolean);
      console.log(filteredItems);
    
      // Return a new tree object with the updated items
      return { ...tree, items: filteredItems };
    };
  
    const renameNode = (tree, folderId, newName) => {
      if (tree.id === folderId) {
        return { ...tree, name: newName };
      }
  
      let latestNode = [];
  
      latestNode = tree.items.map((ob) => {
        return renameNode(ob, folderId, newName);
      });
      return { ...tree, items: latestNode };
    };
  
    return { insertNode, deleteNode, renameNode };
  };
  
  export default useTraverseTree;