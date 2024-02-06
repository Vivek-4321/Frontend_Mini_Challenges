const useTraverseTree = () => {
    // Add a file or folder in tree
    // Can be optimised using Dynamic Programming
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
        return null;
      }
  
      let latestNode = [];

      latestNode = tree.items.map((ob) => {
        return deleteNode(ob, folderId);
      });
      return { ...tree, items: latestNode };
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