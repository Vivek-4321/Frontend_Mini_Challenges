import {useState} from 'react';
import './InfinitelyNestedComments.css';
import CommentData from './CommentData.js';
import Comments from './Comments.tsx';
import useTraverseTree from './useTraverseTree.tsx';

function InfinitelyNestedComments() {

  const { insertNode, deleteNode, renameNode } = useTraverseTree();
  const [comments, setComments] = useState(CommentData);

  const handleInsertNode = (commentId, item) => {
    const finalTree = insertNode(CommentData,commentId, item);
    setComments(finalTree);
    console.log(finalTree);
  }

  const handleDeleteNode = (commentId) => {
    const finalTree = deleteNode(comments, commentId);
    setComments(finalTree);
    console.log(finalTree);
  }

  const handleRenameNode = (commentId, newName) => {
    const finalTree = renameNode(comments, commentId, newName);
    setComments(finalTree);
    console.log(finalTree);
  }

  return (
    <div className='infinitely_nested_comments__container'>
      <h2>Infinitely Nested Comments</h2>
        <div className="infinitely_nested_comments__container__content">
        <Comments handleInsertNode={handleInsertNode} handleDeleteNode={handleDeleteNode} handleRenameNode={handleRenameNode} comment={comments}/>
          
        </div>
    </div>
  )
}

export default InfinitelyNestedComments;