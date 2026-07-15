const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/openapi.json', (req, res) => {
    res.json(openapiSpec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

class Task {
    constructor(id, title, isDone){
        this.id = id;
        this.title = title;
        this.isDone = isDone;
    }
}

const tasks = [];

app.get('/', (req, res) =>{
    res.json({
        "name": "TaskAPI",
        "version": "1.0",
        "endpoints": "[/tasks]"
    });
});

app.get('/health', (req, res) => {
    res.json({status : 'ok'});
});

app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);
    
    if(!task){
        return res.status(404).json({
            "error": `Task ${id} not found`
        });
    }
    return res.json(task);
});

app.post('/tasks', (req, res) => {
    const {title, isDone} = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({
            "error": "No valid title found"
        });
    }

    if (typeof(isDone) !== "boolean" ) {
        return res.status(400).json({
            "error": "No valid task status found"
        });
    }

    let id = 1;
    if(tasks.length > 0){
        id = tasks[tasks.length - 1].id + 1;
    }

    tasks.push(new Task(id, title, isDone));
    return res.status(201).json({
        "message": "Task created"
    });
});

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const {title, isDone} = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({
            "error": "No valid title found"
        });
    }

    if (typeof(isDone) !== "boolean" ) {
        return res.status(400).json({
            "error": "No valid task status found"
        });
    }

    const task = tasks.find(task => task.id === id);
    if(!task){
        return res.status(404).json({
            "error": `Task ${id} not found`
        });
    }

    task.title = title;
    task.isDone = isDone;

    return res.status(201).json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.findIndex(task => task.id === id);

    if(task === -1){
        return res.status(404).json({
            "error": `Task ${id} not found`
        });
    }

    tasks.splice(task, 1);
    return res.sendStatus(204);
});

app.get('/search', (req, res) =>{
    const {query} = req.query
    
    if(typeof(query) !== 'string' || query.trim() === ""){
        return res.status(400).json({
            "error":"Query requiered"
        });
    }

    const results = tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase())
    );

    return res.status(200).json(results);
});

app.listen(port, () => console.log(`Running http://localhost:${port}`))