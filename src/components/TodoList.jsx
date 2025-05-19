import {useEffect, useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import {FaCheck} from "react-icons/fa";
import {FaListCheck} from "react-icons/fa6";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');
    const [editTaskId, setEditTaskId] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=4');
            const todos = await response.json();
            setTasks(todos);
        } catch (error) {
            console.log('Error fetching todos:', error);
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleAddTask = async () => {
        if (inputValue.trim() === '') {
            return;
        }

        const newTask = {
            title: inputValue, completed: false
        };

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST', body: JSON.stringify(newTask), headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const addedTask = await response.json();
            setTasks((prevTasks) => [...prevTasks, addedTask]);
            setInputValue('');
            toast.success('Task added successfully');
        } catch (error) {
            console.log('Error adding task:', error);
            toast.error('Error adding task');
        }
    };

    const handleTaskCheckboxChange = (taskId) => {
        setTasks((prevTasks) => prevTasks.map((task) => task.id === taskId ? {
            ...task, completed: !task.completed
        } : task));
    };

    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        if (editTaskId === taskId) {
            setEditTaskId(null);
            setInputValue('')
        }
        toast.success('Task deleted successfully');
    };

    const handleEditTask = (taskId) => {
        if (editTaskId === taskId) {
            setEditTaskId(null);
            setInputValue('');
            return;
        }
        setEditTaskId(taskId);
        const taskToEdit = tasks.find((task) => task.id === taskId);
        setInputValue(taskToEdit.title);
    };

    const handleUpdateTask = async () => {
        if (inputValue.trim() === '') {
            return;
        }

        const updatedTask = {
            title: inputValue, completed: false
        };

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editTaskId}`, {
                method: 'PUT', body: JSON.stringify(updatedTask), headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const updatedTaskData = await response.json();
            setTasks((prevTasks) => prevTasks.map((task) => task.id === editTaskId ? {
                ...task, title: updatedTaskData.title
            } : task));
            setInputValue('');
            setEditTaskId(null);
            toast.success('Task updated successfully');
        } catch (error) {
            console.log('Error updating task:', error);
            toast.error('Error updating task');
        }
    };

    const handleCompleteAll = () => setTasks((tasks) => tasks.map((task) => ({...task, completed: true})));

    const handleFilterChange = (filterType) => setFilter(filterType);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'completed') {
            return task.completed;
        } else if (filter === 'uncompleted') {
            return !task.completed;
        }
        return true;
    });

    return (<div className="container">
        <ToastContainer/>
        <div className="todo-app">
            <h2>
                <a href='https://github.com/NuclearMissile/react-todo-list'>Todo List</a>
            </h2>
            <div className="row">
                <FaListCheck/>
                <input
                    type="text"
                    className="add-task"
                    id="add"
                    placeholder="Add your todo"
                    autoFocus
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button id="btn" onClick={editTaskId ? handleUpdateTask : handleAddTask}>
                    {editTaskId ? 'Update' : 'Add'}
                </button>
            </div>

            <div className="mid">
                <FaCheck/>
                <p id="complete-all" onClick={handleCompleteAll} style={{marginLeft: 10}}>Complete all</p>
            </div>

            <ul id="list">
                {filteredTasks.map((task) => (
                    <li key={task.id} className={editTaskId === task.id ? 'edit-mode' : ''}>
                        <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            data-id={task.id}
                            className="custom-checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskCheckboxChange(task.id)}
                        />
                        <label htmlFor={`task-${task.id}`}>{task.title}</label>
                        <div>
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                                className="edit"
                                data-id={task.id}
                                onClick={() => handleEditTask(task.id)}
                                alt='edit'
                            />
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                                className="delete"
                                data-id={task.id}
                                onClick={() => handleDeleteTask(task.id)}
                                alt='delete'
                            />
                        </div>
                    </li>))}
            </ul>

            <div className="filters">
                <div className="dropdown">
                    <button className="dropbtn">Filter</button>
                    <div className="dropdown-content">
                        <a className={filter === 'all' ? 'filter-selected' : ''}
                           href="#" id="all" onClick={() => handleFilterChange('all')}>
                            All
                        </a>
                        <a className={filter === 'uncompleted' ? 'filter-selected' : ''}
                           href="#" id="rem" onClick={() => handleFilterChange('uncompleted')}>
                            Uncompleted
                        </a>
                        <a className={filter === 'completed' ? 'filter-selected' : ''} href="#"
                           id="com" onClick={() => handleFilterChange('completed')}>
                            Completed
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};