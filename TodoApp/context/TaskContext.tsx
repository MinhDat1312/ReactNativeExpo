import React, { createContext, useState, useEffect } from "react";

const API_URL = "https://68308e1e6205ab0d6c398e22.mockapi.io/todos";

export interface Task {
  id: string;
  title: string;
  status: boolean;
}

interface TaskContextType {
  tasks: Task[];
  fetchTasks: () => void;
  addTask: (text: string) => void;
  updateTask: (id: string, newText: string) => void;
  deleteTask: (id: string) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  toggleTaskComplete: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userName, setUserName] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (text: string) => {
    if (!text.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Date.now().toString(), title: text, status: false }),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id: string, newText: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newText }),
      });
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const toggleTaskComplete = async (id: string) => {
    try {
      const current = tasks.find((t) => t.id === id);
      if (!current) return;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, status: !current.status }),
      });
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        editingTask,
        setEditingTask,
        userName,
        setUserName,
        toggleTaskComplete
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
