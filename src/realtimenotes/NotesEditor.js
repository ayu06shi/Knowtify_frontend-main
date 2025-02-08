import { useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext";

const NotesEditor = ({ note }) => {
    const { editNote } = useContext(NotesContext);
    const [content, setContent] = useState(note.content);

    const handleChange = (e) => {
        setContent(e.target.value);
        editNote(note._id, e.target.value);
    };

    return (
        <textarea
            value={content}
            onChange={handleChange}
            className="w-full h-40 border p-2"
        />
    );
};

export default NotesEditor;
