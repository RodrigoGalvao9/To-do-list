const cors = require('cors');
app.use(cors());

app.get('/api/tasks/stats', (req, res) => {
    Task.countDocuments({}, (err, created) => {
        if (err) return res.status(500).json({ message: 'Erro ao contar tarefas.' });
        Task.countDocuments({ completed: true }, (err, completed) => {
            if (err) return res.status(500).json({ message: 'Erro ao contar tarefas concluídas.' });
            res.json({ created, completed });
        });
    });
});

app.get('/api/tasks', (req, res) => {
    Task.find({}, (err, tasks) => {
        if (err) return res.status(500).json({ message: 'Erro ao obter tarefas.' });
        res.json(tasks);
    });
});

app.put('/api/tasks/:id/complete', (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true }, (err, task) => {
        if (err) return res.status(500).json({ message: 'Erro ao concluir tarefa.' });
        res.json(task);
    });
});

app.delete('/api/tasks/:id', (req, res) => {
    Task.findByIdAndDelete(req.params.id, (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao excluir tarefa.' });
        res.status(204).send();
    });
});

app.post('/api/tasks', (req, res) => {
    const newTask = new Task({ text: req.body.text, completed: false });
    newTask.save((err, task) => {
        if (err) return res.status(500).json({ message: 'Erro ao criar tarefa.' });
        res.status(201).json(task);
    });
});

// Contar todas as tarefas
app.get('/tasks/count/created', async (req, res) => {
    try {
      const totalCreated = await Task.countDocuments({});
      res.json({ totalCreated });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao contar tarefas criadas.' });
    }
  });
  
  // Contar tarefas concluídas
  app.get('/tasks/count/completed', async (req, res) => {
    try {
      const totalCompleted = await Task.countDocuments({ completed: true });
      res.json({ totalCompleted });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao contar tarefas concluídas.' });
    }
  });

  // Inicializar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});