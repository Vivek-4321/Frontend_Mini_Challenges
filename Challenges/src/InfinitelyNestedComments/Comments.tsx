import React from 'react';
import comments from './CommentData.js';

const Comments = ({ comment }) => (
  <div>
    <h3>{comment.name}</h3>
    {comment.items.length > 0 && (
      <ul>
        {comment.items.map(item => (
          <li key={item.id}>
            <Comments comment={item} />
          </li>
        ))}
      </ul>
    )}
  </div>
);


export default Comments;