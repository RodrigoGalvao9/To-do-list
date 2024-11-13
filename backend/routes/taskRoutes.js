const express = require('express');
const Task = require('../models/task');
const router = express.Router();

// Listar todas as tarefas
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        if (tasks.length === 0) {
            return res.status(200).json({ message: "Não há tarefas cadastradas." });
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter tarefas.', error });
    }
});

// Criar uma nova tarefa
router.post('/', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "O título da tarefa é obrigatório." });
    }

    try {
        const newTask = await Task.create({ title });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar tarefa.', error });
    }
});

// Marcar uma tarefa como concluída
router.put('/:id/complete', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }
        task.completed = true;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar tarefa.', error });
    }
});

// Contar tarefas criadas
router.get('/count/created', async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        res.status(200).json({ totalCreated: totalTasks });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao contar tarefas criadas.', error });
    }
});

// Contar tarefas concluídas
router.get('/count/completed', async (req, res) => {
    try {
        const totalCompleted = await Task.countDocuments({ completed: true });
        res.status(200).json({ totalCompleted });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao contar tarefas concluídas.', error });
    }
});

// Excluir uma tarefa
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }
        res.status(200).json({ message: "Tarefa excluída com sucesso." });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir tarefa.', error });
    }
});

module.exports = router;
