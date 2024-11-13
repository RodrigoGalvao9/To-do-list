import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [totalCreated, setTotalCreated] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);

    // Carregar tarefas e contadores
    useEffect(() => {
        // Carregar todas as tarefas
        axios.get('http://localhost:3000/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.error('Erro ao carregar tarefas:', error));

        // Contar tarefas criadas
        axios.get('http://localhost:3000/tasks/count/created')
            .then(response => setTotalCreated(response.data.totalCreated));

        // Contar tarefas concluídas
        axios.get('http://localhost:3000/tasks/count/completed')
            .then(response => setTotalCompleted(response.data.totalCompleted));
    }, []);

    // Criar nova tarefa
    const createTask = () => {
        axios.post('http://localhost:3000/tasks', { title: newTaskTitle })
            .then(response => {
                setTasks([...tasks, response.data]);
                setNewTaskTitle('');
            })
            .catch(error => console.error('Erro ao criar tarefa:', error));
    };

    // Marcar tarefa como concluída
    const completeTask = (id) => {
        axios.put(`http://localhost:3000/tasks/${id}/complete`)
            .then(response => {
                const updatedTasks = tasks.map(task => 
                    task._id === id ? response.data : task
                );
                setTasks(updatedTasks);
            })
            .catch(error => console.error('Erro ao concluir tarefa:', error));
    };

    // Excluir tarefa
    const deleteTask = (id) => {
        axios.delete(`http://localhost:3000/tasks/${id}`)
            .then(() => {
                const updatedTasks = tasks.filter(task => task._id !== id);
                setTasks(updatedTasks);
            })
            .catch(error => console.error('Erro ao excluir tarefa:', error));
    };

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Digite o título da nova tarefa"
            />
            <button onClick={createTask}>Adicionar Tarefa</button>

            <h2>Contadores</h2>
            <p>Total de Tarefas Criadas: {totalCreated}</p>
            <p>Total de Tarefas Concluídas: {totalCompleted}</p>

            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.title} - {task.completed ? "Concluída" : "Pendente"}
                        <button onClick={() => completeTask(task._id)}>Concluir</button>
                        <button onClick={() => deleteTask(task._id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;