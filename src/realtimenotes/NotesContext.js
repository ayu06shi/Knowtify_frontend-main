import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export const NotesContext = createContext();

const socket = io("http://localhost:4000"); // Connect to Backend

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);

    // Fetch Initial Notes from Backend
    useEffect(() => {
        axios.get("http://localhost:4000/notes/getNote").then(response => {
            setNotes(response.data);
        });

        // Listen for Real-time Note Updates
        socket.on("noteUpdated", (updatedNote) => {
            setNotes(prevNotes =>
                prevNotes.map(note => note._id === updatedNote.id ? { ...note, content: updatedNote.content } : note)
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const editNote = (id, content) => {
        socket.emit("editNote", { id, content });
    };

    return (
        <NotesContext.Provider value={{ notes, editNote }}>
            {children}
        </NotesContext.Provider>
    );
};
