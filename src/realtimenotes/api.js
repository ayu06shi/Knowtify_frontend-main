const API_URL = 'http://localhost:5000/courses';

export const fetchNotes = async (courseId) => {
  const response = await fetch(`${API_URL}/${courseId}/notes`);
  return response.json();
};

export const addNote = async (courseId, text, user) => {
  const response = await fetch(`${API_URL}/${courseId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, user })
  });
  return response.json();
};

export const updateNote = async (courseId, noteId, text) => {
  const response = await fetch(`${API_URL}/${courseId}/notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return response.json();
};