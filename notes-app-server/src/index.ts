import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/notes",async (req, res) => {
    const notes = await prisma.notes.findMany();
    res.json(notes);
})

app.post("/api/notes",async (req, res) => {
    const {title, content} = req.body;
    if (!title || !content) {
        return res.status(400).send("Title and Content fields are required")
    }
    try {
        const note = await prisma.notes.create({
            data: {title, content}
        });
        res.json(note)
    }
    catch(error) {
        res.status(500).send("Something when wrong!")
    }
})

app.put("/api/notes/:id",async (req, res) => {
    const {title, content} = req.body;
    const id = parseInt(req.params.id)

    if (!title || !content) {
        return res.status(400).send("Title and Content fields are required")
    }
    if (!id || isNaN(id)){
        return res.status(400).send("An Id must be a valid number")
    }
    try {
        const updatedNote = await prisma.notes.update({
            where: {id},
            data: {title, content}
        });
        res.json(updatedNote)
    }
    catch(error) {
        res.status(500).send("Something when wrong!")
    }
})

app.delete("/api/notes/:id",async (req, res) => {
    const id = parseInt(req.params.id)

    if (!id || isNaN(id)){
        return res.status(400).send("An Id must be a valid number")
    }
    try {
        const deleteNote = await prisma.notes.delete({
            where: {id},
        });
        res.status(204).send("Note successfully deleted")
    }
    catch(error) {
        res.status(500).send("Something when wrong!")
    }
})

app.listen(5000, ()=>{
    console.log("Server running on localhost:5000")
});

