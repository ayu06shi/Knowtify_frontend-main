import { NotesProvider } from "./context/NotesContext";
import NotesDisplay from "./components/NotesDisplay";

function App() {
    return (
        <NotesProvider>
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold">Real-time Notes</h1>
                <NotesDisplay />
            </div>
        </NotesProvider>
    );
}

export default App;
