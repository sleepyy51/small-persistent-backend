const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./docs/openapi.json');
const pool = require('./classes/connection');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/openapi.json', (req, res) => {
    res.json(openapiSpec);
});

app.get('/', (req, res) =>{
    res.json({
        "name": "TaskAPI",
        "version": "2.0",
        "endpoints": "[/tasks]"
    });
});

app.get('/health', (req, res) => {
    res.json({status : 'ok'});
});

app.get('/tasks', async (req, res) => {
    try{
        const { rows } = await pool.query(
            'select * from tasks;'
        )
        res.status(200).json(rows);
    }catch (err){
        console.log(err);
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
});

app.get('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "Invalid task id"
        });
    }

    try{
        const { rows } = await pool.query(
            'select * from tasks where id = $1',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                "error": `Task ${id} not found`
            });
        }

        return res.status(200).json(rows[0]);
    }catch (err){
        console.log(err);
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
});

app.post('/tasks', async (req, res) => {
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
    try{
        await pool.query(
            'insert into tasks (title, completed) values ($1, $2)',
            [title, isDone]
        );

        return res.status(200).json({
            "message": "Task succesfully created"
        });
    }catch (err){
        console.log(err);
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
});

app.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "Invalid task id"
        });
    }

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

    try{
        const { rows } = await pool.query(
            'select * from tasks where id = $1',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                "error": `Task ${id} not found`
            });
        }

        await pool.query(
            'update tasks set title = $1, completed = $2 where id = $3',
            [title, isDone, id]
        );

        return res.status(200).json({
            "message": "Task updated sucessfully"
        });
    }catch (err){
        console.log(err);
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    
    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "Invalid task id"
        });
    }

    try{
        const {rows} = await pool.query(
            'select * from tasks where id = $1',
            [id]
        );

        if(rows.length === 0){
            return res.status(404).json({
                "error": `Task ${id} not found`
            });
        }

        await pool.query(
            'delete from tasks where id = $1',
            [id]
        );
        
        return res.sendStatus(204);
    }catch (err){
        console.log(err);
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
});

app.get('/search', async (req, res) =>{
    const {query} = req.query
    
    if(typeof(query) !== 'string' || query.trim() === ""){
        return res.status(400).json({
            "error":"Query required"
        });
    }

    try{
        const {rows} = await pool.query(
            'select * from tasks where title ilike $1',
            [`%${query}%`]
        );

        return res.status(200).json(rows);
    }catch (err){
        console.log(err);
        return res.status(500).json({
            "error": "Internal server error"
        });
    }
});

app.listen(port, () => console.log(`Running http://localhost:${port}`))