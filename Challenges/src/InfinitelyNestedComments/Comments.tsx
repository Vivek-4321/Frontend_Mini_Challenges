import {useEffect, useState, useRef} from 'react';
import comments from './CommentData.js';
import { IconContext } from "react-icons";
import { IoPencilSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const Comments = ({ handleInsertNode = () => {}, handleDeleteNode = () => {}, handleRenameNode = () => {},comment }) => {

  const [expand, setExpand] = useState(false);
  const [value, setValue] = useState('');
  const [isRename, setIsRename] = useState(false);
  const [newName, setNewName] = useState('');

  const onAddComment = (e, commentId) => {
    if (e.keyCode ===  13 && e.target.value && (e.ctrlKey || e.metaKey)) {
      // Reset the expand state to hide the textarea
      // Call the handleInsertNode function with the comment ID and value
      handleInsertNode(commentId, e.target.value);
      // Clear the textarea value
      setValue('');
      setExpand(prevExpand => !prevExpand);
    }
  };

  const onRenameFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleRenameNode(comment.id, e.target.value);
      setIsRename(false);
    }
  }

  return(
    <div>
    <div className='comment__container'>
      {isRename && <div>
        <div className="inputContainer__comment"> 
        <textarea
          defaultValue={comment.name}
          autoFocus
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={onRenameFolder}
          onBlur={() => setIsRename(false)}
          className="inputContainer__input__comment"
        />
  </div>
        </div>}
        {
          !isRename && <h3>{comment?.name}</h3>
        }
      
      <span className='comment__btn_group'>
      <IconContext.Provider value={{ color: "white",className: "global-class-name", size: "1.6em"}}>
        <button onClick={() => setExpand(!expand)}><FaReply/></button>
        <button onClick={() => setIsRename(!isRename)}><IoPencilSharp /></button>
        <button onClick={() => handleDeleteNode(comment.id)}><MdDeleteOutline /></button>
      </IconContext.Provider>
      </span>
    </div>

        <div className="input_container" style={{display: expand ? "block" : "none", paddingLeft: 25}}>
        <textarea
                    className="inputContainer__input"
                    autoFocus
                    onKeyDown={(e) => {onAddComment(e,comment.id)}}
                    onChange={(e) => {setValue(e.target.value)}}
                    onBlur={() => setExpand(false)}
                    />
        </div>

    {comment?.items?.length > 0 && (
      <ul>
        {comment?.items.map(item => (
          <li style={{marginLeft: '30px', marginTop: '5px'}} key={uuidv4()}>
            <Comments handleInsertNode={handleInsertNode} handleDeleteNode={handleDeleteNode} handleRenameNode={handleRenameNode} comment={item} key={uuidv4()}/>
          </li>
        ))}
      </ul>
    )}
  </div>
  ); 
};


export default Comments;