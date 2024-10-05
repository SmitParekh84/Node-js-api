const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser');

const app = express();
const port = 4200;

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

const datafilepath = path.join(__dirname, 'data', 'tasks.json');

function readdatafromfile() {
    const data = fs.readFileSync(datafilepath, 'utf-8');
    return JSON.parse(data);
}

function writedatafromfile(data) {
    fs.writeFileSync(datafilepath, JSON.stringify(data, null, 2));
}

app.get('/tasks', (req, res) => {
    const tasks = readdatafromfile();
    res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const tasks = readdatafromfile();
    const taskid = parseInt(req.params.id, 10);
    const task = tasks.find(task => task.id === taskid);
    if (task) {
        res.json(task);
    }
    else {
        res.status(404).json({ error: 'Task Not Found' });
    }
});

app.post('/tasks', (req, res) => {
    const tasks = readdatafromfile();
    const newtask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title: req.body.title,
        completed: req.body.completed
    }
    tasks.push(newtask);
    writedatafromfile(tasks);
    res.status(201).json(newtask);
});

app.put('/tasks/:id', (req, res) => {
    const tasks = readdatafromfile();
    const taskid = parseInt(req.params.id, 10);
    const taskindex = tasks.findIndex(task => task.id === taskid);
    if (taskindex >= 0) {
        tasks[taskindex].completed = req.body.completed;
        writedatafromfile(tasks);
        res.json(tasks[taskindex]);
    }
    else {
        res.status(404).json({ error: 'Task Not Found' });
    }

});

app.delete('/tasks/:id', (req, res) => {
    const tasks = readdatafromfile();
    const taskid = parseInt(req.params.id, 10);
    const newtask = tasks.filter(task => task.id !== taskid);
    if (newtask.length !== tasks.length) {
        writedatafromfile(newtask);
        res.json({ message: 'Task Deleted' });
    }
    else {
        res.status(404).json({ error: 'Task Not Found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});