import {useState} from 'react';
import './InfinitelyNestedComments.css';
import CommentData from './CommentData.js';
import Comments from './Comments.tsx';

function InfinitelyNestedComments() {

    const [comments, setComments] = useState(CommentData);

  return (
    <div className='infinitely_nested_comments__container'>
        <div className="infinitely_nested_comments__container__content">
        <Comments comment={comments}/>
          
        </div>
    </div>
  )
}

export default InfinitelyNestedComments;