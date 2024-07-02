import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaMinus, FaRandom } from 'react-icons/fa';
import './DataStructure.css';

type DataStructureType = 'stack' | 'queue';

interface DataItem {
  value: string;
  id: number;
}

const DataStructure: React.FC = () => {
  const [dataStructureType, setDataStructureType] = useState<DataStructureType>('stack');
  const [items, setItems] = useState<DataItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [nextId, setNextId] = useState(0);
  const [animatingItemId, setAnimatingItemId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [items]);

  const addItem = () => {
    if (inputValue.trim() === '') return;

    const newItem: DataItem = { value: inputValue, id: nextId };
    setNextId(nextId + 1);

    if (dataStructureType === 'stack') {
      setItems([...items, newItem]);
    } else {
      setItems([newItem, ...items]);
    }

    setInputValue('');
    setAnimatingItemId(newItem.id);
    setTimeout(() => setAnimatingItemId(null), 500);
  };

  const removeItem = () => {
    if (items.length === 0) return;

    const itemToRemove = dataStructureType === 'stack' ? items[items.length - 1] : items[0];
    setAnimatingItemId(itemToRemove.id);

    setTimeout(() => {
      if (dataStructureType === 'stack') {
        setItems(items.slice(0, -1));
      } else {
        setItems(items.slice(1));
      }
      setAnimatingItemId(null);
    }, 500);
  };

  return (
    <div className="data-structure-container">
      <h1>Data Structure Visualizer</h1>
      <div className="data-controls">
        <select
          value={dataStructureType}
          onChange={(e) => setDataStructureType(e.target.value as DataStructureType)}
        >
          <option value="stack">Stack</option>
          <option value="queue">Queue</option>
        </select>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
        />
        <button onClick={addItem}><FaPlus /> Add</button>
        <button onClick={removeItem}><FaMinus /> Remove</button>
        <button onClick={() => setItems([])}><FaRandom /> Clear</button>
      </div>
      <div className={`data-structure ${dataStructureType}`} ref={containerRef}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`item ${animatingItemId === item.id ? 'animating' : ''}`}
            style={{
              animationName: animatingItemId === item.id
                ? (dataStructureType === 'stack'
                  ? (index === items.length - 1 ? 'stackPush' : '')
                  : (index === 0 ? 'queueDequeue' : ''))
                : ''
            }}
          >
            {item.value}
          </div>
        ))}
        {dataStructureType === 'stack' && items.length > 0 && (
          <div className="pointer top">Top</div>
        )}
        {dataStructureType === 'queue' && items.length > 0 && (
          <>
            <div className="pointer front">Front</div>
            <div className="pointer rear">Rear</div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataStructure;