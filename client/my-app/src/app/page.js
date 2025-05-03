'use client'
import { useEffect, useState } from 'react';
import Image from "next/image";

export default function Home() {
  // State, um die Antwort vom Express-Server zu speichern
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status_id: 1
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  // useEffect, um beim Laden der Seite die API anzufragen
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[FRONTEND] Starte API-Aufruf zu /api/tasks');
        const response = await fetch('http://localhost:5000/api/tasks');
        console.log('[FRONTEND] API Response Status:', response.status);
        
        const result = await response.json();
        console.log('[FRONTEND] Empfangene Daten:', result);
        
        // Wenn Ergebnis ein Array ist direkt verwenden, sonst in Array umwandeln
        const tasksArray = Array.isArray(result) ? result : [result];
        setData(tasksArray);
      } catch (error) {
        console.error('[FRONTEND] Fehler beim API-Aufruf:', error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Status und Types laden
        const [statusRes, typesRes] = await Promise.all([
          fetch('http://localhost:5000/api/statuses'),
          fetch('http://localhost:5000/api/types')
        ]);
        
        const statusData = await statusRes.json();
        const typesData = await typesRes.json();

        // Finde "open" Status ID
        const openStatus = statusData.find(s => s.name.toLowerCase() === 'open');
        
        setStatusOptions(statusData);
        setTypeOptions(typesData);
        setNewTask(prev => ({
          ...prev,
          status_id: openStatus?.id || 1,
          type_id: 1 // Default Type
        }));

      } catch (error) {
        console.error('Fehler beim Laden:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      
      if (response.ok) {
        // Formular komplett zurücksetzen
        setNewTask({
          title: '',
          description: '',
          status_id: statusOptions.find(s => s.name === 'open')?.id || 1,
          type_id: typeOptions[0]?.id || 1
        });

        // Daten aktualisieren
        const createdTask = await response.json();
        setData(prev => [...prev, createdTask]);
        
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const newData = data.filter(task => task.id !== id);
        setData(newData);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTask),
      });
      
      if (response.ok) {
        setShowEditModal(false);
        const updatedData = data.map(task => 
          task.id === editingTask.id ? {...editingTask} : task
        );
        setData(updatedData);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 gap-16">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-6xl">
        {data && (
          <div className="w-full bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Tickets Overview</h2>
              <span className="text-sm text-gray-500">{data.length} Aufgaben gesamt</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-sm bg-gray-50">
                    <th className="px-4 py-3 font-medium">Titel</th>
                    <th className="px-4 py-3 font-medium">Beschreibung</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Typ</th>
                    <th className="px-4 py-3 font-medium">Erstellt am</th>
                    <th className="px-4 py-3 font-medium text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                        {task.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === 'done' ? 'bg-green-100 text-green-800' :
                          task.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {task.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(task.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setShowEditModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Neue Eingabezeile */}
                  <tr className="bg-blue-50 hover:bg-blue-100 transition-colors">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        required
                        className="w-full p-2 border rounded bg-transparent"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <textarea
                        className="w-full p-2 border rounded bg-transparent"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        className="w-full p-2 border rounded bg-gray-100"
                        value={statusOptions.find(s => s.id === newTask.status_id)?.name || 'Open'}
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        className="w-full p-2 border rounded bg-transparent"
                        value={newTask.type_id}
                        onChange={(e) => setNewTask({...newTask, type_id: parseInt(e.target.value)})}
                      >
                        {typeOptions.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date().toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        disabled={!newTask.title}
                      >
                        Speichern
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Aufgabe bearbeiten</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-2">Titel*</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Beschreibung</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <select
                  className="w-full p-2 border rounded"
                  value={editingTask?.status_id}
                  onChange={(e) => setEditingTask({...editingTask, status_id: parseInt(e.target.value)})}
                >
                  {statusOptions.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Aktualisieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
