import { useState, useEffect } from 'react';

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const [data, setData] = useState({ tasks: [], habits: { study: [] } });
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetch('/data')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);
 
  const saveData = (updatedData) => {
    fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(() => setData(updatedData))
      .catch(console.error);
  };

  const handleSaveTask = () => {
    const newTask = { title, dueDate };
    const updatedData = { ...data, tasks: [...(data.tasks || []), newTask] };
    
    saveData(updatedData);
    setTitle('');
    setDueDate('');
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = (data.tasks || []).filter((_, i) => i !== index);
    saveData({ ...data, tasks: updatedTasks });
  };

  const handleStudyDone = () => {
    const today = getTodayDate();
    const currentHabits = data.habits || {};
    const studyDates = currentHabits.study || [];

    if (studyDates.includes(today)) return;

    const updatedData = {
      ...data,
      habits: {
        ...currentHabits,
        study: [...studyDates, today]
      }
    };
    
    saveData(updatedData);
  };

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {(data.tasks || []).map((task, i) => (
          <li key={i}>
            {task.title} (Due: {task.dueDate})
            <button onClick={() => handleDeleteTask(i)}>Delete</button>
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
      <button onClick={handleSaveTask}>Save Task</button>

      <h2>Habits</h2>
      <p>Study completed: {(data.habits?.study || []).length} times</p>
      <button onClick={handleStudyDone}>Mark study done today</button>
    </div>
  );
}

export default App;
