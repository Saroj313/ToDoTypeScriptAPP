import React, { FC, ChangeEvent, useState,useEffect } from "react";
import "./App.css";
import TodoTask from "./Components/TodoTask";
import { ITask } from "./Interfaces";
import axios from "axios";

const App: FC = () => {
  const [task, setTask] = useState<string>("");
  const [deadline, setDealine] = useState<number>(0);
  const [todoList, setTodoList] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
   const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      const fetchedTasks = response.data;
      console.log('Fetched tasks:', fetchedTasks);
      setTodoList(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === "task") {
      setTask(event.target.value);
    } else {
      setDealine(Number(event.target.value));
    }
  };

const addTask = async (): Promise<void> => {
  try {
    const newTask = { taskName: task, deadline: deadline };
    setTodoList([...todoList, newTask]);
    setTask("");
    setDealine(0);

    await axios.post('/api/tasks', { taskName: task, deadline });
    console.log('Task added successfully to MongoDB');

    // You might also fetch the tasks again after adding a new one
    // to ensure that the list is in sync with the backend
    // fetchTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
};


  const completeTask = (taskNameToDelete: string): void => {
    setTodoList(
      todoList.filter((task) => {
        return task.taskName != taskNameToDelete;
      })
    );
  };

  return (
    <div className="App">
      <div className="header">
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Task..."
            name="task"
            value={task}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Deadline (in Days)..."
            name="deadline"
            value={deadline}
            onChange={handleChange}
          />
        </div>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="todoList">
        {todoList.map((task: ITask, key: number) => {
          return <TodoTask key={key} task={task} completeTask={completeTask} />;
        })}
      </div>
    </div>
  );
};

export default App;
