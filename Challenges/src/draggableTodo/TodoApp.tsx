import React, { useState, useRef } from 'react';
import './Todo.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Todo {
  id: number;
  text: string;
  status: 'todo' | 'doing' | 'completed';
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', status: 'todo' },
    { id: 2, text: 'Build a todo app', status: 'doing' },
    { id: 3, text: 'Deploy the app', status: 'completed' },
  ]);
  const [dragging, setDragging] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const dragItem = useRef<Todo | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);

  const onDragStart = (e: React.DragEvent, todo: Todo) => {
    dragItem.current = todo;
    dragNode.current = e.target as HTMLDivElement;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const onDragEnter = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (!dragging) return;
    setDragOverItem(targetId);
  };

  const handleDragEnd = (e: DragEvent) => {
    setDragging(false);
    setDragOverItem(null);
    dragNode.current?.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
  };

  const onDrop = (e: React.DragEvent, targetStatus: 'todo' | 'doing' | 'completed') => {
    e.preventDefault();
    if (!dragItem.current) return;

    setTodos(prevTodos => {
      const newTodos = prevTodos.filter(todo => todo.id !== dragItem.current!.id);
      const dropIndex = newTodos.findIndex(todo => todo.id === dragOverItem);
      if (dropIndex !== -1) {
        newTodos.splice(dropIndex, 0, { ...dragItem.current!, status: targetStatus });
      } else {
        newTodos.push({ ...dragItem.current!, status: targetStatus });
      }
      return newTodos;
    });

    setDragging(false);
    setDragOverItem(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      status: 'todo'
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const editTodo = (id: number) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setEditingId(id);
      setEditText(todoToEdit.text);
    }
  };

  const saveEdit = () => {
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const getItemStyle = (todo: Todo) => {
    if (dragOverItem === todo.id) {
      return { marginTop: '2rem' };
    }
    return {};
  };

  return (
    <div className="todo-app">
      <div className="add-todo">
        <input
          type="text"
          placeholder="Add a new todo"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addTodo((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
      </div>
      <div className="todo-lists">
        {(['todo', 'doing', 'completed'] as const).map((status) => (
          <div
            key={status}
            className={`todo-list ${status}`}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
          >
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            {todos
              .filter(todo => todo.status === status)
              .map(todo => (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.status === 'completed' ? 'completed' : ''} ${dragging && dragItem.current?.id === todo.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, todo)}
                  onDragEnter={(e) => onDragEnter(e, todo.id)}
                  style={getItemStyle(todo)}
                >
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={saveEdit}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                      {todo.text}
                      <div className="todo-actions">
                        <FaEdit className="edit-icon" onClick={() => editTodo(todo.id)} />
                        <FaTrash className="delete-icon" onClick={() => deleteTodo(todo.id)} />
                      </div>
                    </>
                  )}
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;