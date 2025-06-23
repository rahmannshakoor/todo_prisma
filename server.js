const express = require("express")
const app = express()
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi this is a todo list backend demo")
})

app.get('/todos', async (req, res) => {
    try {
      const todos = await prisma.todo.findMany();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.get('/todos/:id', async (req, res) => {
    const id = Number(req.params.id);
    const todo = await prisma.todo.findUnique({ where: { id } });
  
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
  
    res.json(todo);
  });
  app.post('/todos', async (req, res) => {
    console.log("BODY RECEIVED:", req.body);
    const { title } = req.body;
  
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string.' });
    }
  
    try {
      const todo = await prisma.todo.create({
        data: { title }  
      });
      res.status(201).json(todo); 
    } catch (error) {
      res.status(500).json({ error: 'Failed to create todo', detail: error.message });
    }
  });

app.put('/todos/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, completed } = req.body;
  
    try {
      // Check if the todo exists first
      const existing = await prisma.todo.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Todo not found" });
      }
  
      // Update the todo
      const updated = await prisma.todo.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(completed !== undefined && { completed }),
        }
      });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.listen(3000)