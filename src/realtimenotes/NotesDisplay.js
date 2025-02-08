import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import NotesEditor from "./NotesEditor";

const NotesDisplay = () => {
    const { notes } = useContext(NotesContext);

    return (
        <div>
            {notes.map(note => (
                <div key={note._id} className="border p-3 my-2">
                    <h3 className="text-xl font-bold">{note.title}</h3>
                    <NotesEditor note={note} />
                </div>
            ))}
        </div>
    );
};

export default NotesDisplay;
