import './App.css';
import React, { useEffect, useState } from 'react';

const API_URL = "https://notesappapi-tbrz.onrender.com/"

type Note = {
  id: number,
  title: string,
  content: string,
}

function App() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note []>([])

  useEffect(()=>{
    const fetchNotes = async ()=>{
      try{
        const response = await fetch(`${API_URL}notes`)
        const allnotes: Note[] = await response.json()
        setNotes(allnotes)
      }
      catch(error){
        console.log(error)
      }
    }
    fetchNotes();
  }, [])

  const handleAddNote = async (e: React.FormEvent)=>{
    e.preventDefault()
    try{
      const response = await fetch(`${API_URL}api/notes/`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {title, content}
        )
      })
      const newNote  = await response.json()
      setNotes([newNote, ...notes])
      setTitle("")
      setContent("")
    }
    catch(error) {
      console.log(error)
    }
  }

  const handleNoteClick = (note: Note)=>{
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleUpdateNote = async (e: React.FormEvent)=>{
    e.preventDefault()
    if (!selectedNote){
      return
    }
    try {
      const response = await fetch(`${API_URL}api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {title, content})
      })
      const updatedNote = await response.json()

      const updatedNotesList = notes.map(note=>(note.id === selectedNote.id ? updatedNote : note))

      setNotes(updatedNotesList)
      setTitle("")
      setContent("")
      setSelectedNote(null)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNote = async (e: React.MouseEvent, noteid: Number)=>{
    e.stopPropagation()
    try {
      await fetch(`${API_URL}api/notes/${noteid}`, {
        method: "DELETE",
      })
      const newList = notes.filter(instance=>(instance.id !== noteid))
      setNotes(newList)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = ()=>{
    setTitle('')
    setContent('')
    setSelectedNote(null)
  }

  return (
    <div className='AppContainer'>
      <form className='notes-form' onSubmit={e=>(selectedNote ? handleUpdateNote(e) : handleAddNote(e))}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required>
        </input>
        <textarea placeholder='Content' rows={10} value={content} onChange={e=>setContent(e.target.value)} required>
        </textarea>
        {selectedNote ? (
        <div className='edit-buttons'>
            <button type='submit'>Save</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>) :
        <button type='submit'>Add Note</button>
        }
      </form>
      <div className='notes-grid'>
        {notes.map(note=>(
          <div className='notes-item' key={note.id} onClick={()=>handleNoteClick(note)} >
          <div className='notes-header'>
            <button onClick={(e)=>deleteNote(e, note.id)}>x</button>
          </div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
        ))}
      </div>
    </div>
    );
}

export default App;
