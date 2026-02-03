import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState({ tasks: [] });
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetch('/data')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleSave = () => {
    const newTask = { title, dueDate };
    const updatedData = { ...data, tasks: [...(data.tasks || []), newTask] };

    fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(() => {
        setData(updatedData);
        setTitle('');
        setDueDate('');
      })
      .catch(console.error);
  };

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {(data.tasks || []).map((task, i) => (
          <li key={i}>
            {task.title} (Due: {task.dueDate})
          </li>
        ))}
      </ul>
      <input 
        type="text" 
        placeholder="Title" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Due Date" 
        value={dueDate} 
        onChange={e => setDueDate(e.target.value)} 
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default App;
