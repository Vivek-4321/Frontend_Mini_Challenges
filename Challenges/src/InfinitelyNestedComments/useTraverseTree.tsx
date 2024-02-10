const useTraverseTree = () => {
  const insertNode = function (tree, commentId, item) {
    if (tree.id === commentId) {
      tree.items.unshift({
        id: new Date().getTime(),
        name: item,
        items: [],
      });

      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob) => {
      const result = insertNode(ob, commentId, item);
      return result;
    });

    return { ...tree, items: latestNode };
  };

  const deleteNode = (tree, commentId) => {
    if (tree.id === commentId) {
      // If this is the node to delete, simply return undefined or null
      return null;
    }
  
    // Map over the items and recursively call deleteNode on each
    const updatedItems = tree.items.map(item => deleteNode(item, commentId));
  
    // Filter out any null values (which represent deleted nodes)
    const filteredItems = updatedItems.filter(Boolean);
    console.log(filteredItems);
  
    // Return a new tree object with the updated items
    return { ...tree, items: filteredItems };
  };

  const renameNode = (tree, commentId, newName) => {
    if (tree.id === commentId) {
      return { ...tree, name: newName };
    }

    let latestNode = [];

    latestNode = tree.items.map((ob) => {
      return renameNode(ob, commentId, newName);
    });
    return { ...tree, items: latestNode };
  };

  return { insertNode, deleteNode, renameNode };
};

export default useTraverseTree;
