// Create Lucide icon components
const {
  Folder,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Edit,
  Save,
  CheckSquare,
  Square,
  Link,
  ExternalLink
} = lucide;

// Convert Lucide icons to React components
const createLucideComponent = (icon) => {
  return (props) => {
    const { size = 24, color = 'currentColor', className = '', ...otherProps } = props;
    return React.createElement(
      'span',
      { className, ...otherProps },
      React.createElement(icon, { size, color })
    );
  };
};

// Create React components from Lucide icons
const LucideFolder = createLucideComponent(Folder);
const LucideCalendar = createLucideComponent(Calendar);
const LucideChevronDown = createLucideComponent(ChevronDown);
const LucideChevronUp = createLucideComponent(ChevronUp);
const LucidePlus = createLucideComponent(Plus);
const LucideX = createLucideComponent(X);
const LucideEdit = createLucideComponent(Edit);
const LucideSave = createLucideComponent(Save);
const LucideCheckSquare = createLucideComponent(CheckSquare);
const LucideSquare = createLucideComponent(Square);
const LucideLink = createLucideComponent(Link);
const LucideExternalLink = createLucideComponent(ExternalLink);

const ContentCalendar = () => {
  // Initial calendar state
  const initialCalendarState = {
    Monday: [
      { id: 1, name: 'Nick', todos: [], note: 'Deliver topics Fri', expanded: false, editing: false, driveLink: '' },
      { id: 2, name: 'Eddie', todos: [], note: 'Deliver topics Fri', expanded: false, editing: false, driveLink: '' },
    ],
    Tuesday: [
      { id: 3, name: 'Kody', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
    ],
    Wednesday: [
      { id: 4, name: 'Davie', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
      { id: 5, name: 'Rob', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
      { id: 6, name: 'Eric', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
    ],
    Thursday: [
      { id: 7, name: 'Jhori', todos: [], note: 'Fri this week', expanded: false, editing: false, driveLink: '' },
    ],
    Friday: [
      { id: 8, name: 'Sid', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
      { id: 9, name: 'Salif', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
      { id: 10, name: 'Alex', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
      { id: 11, name: 'Raf', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
      { id: 12, name: 'Feras', todos: [], note: '', expanded: false, editing: false, driveLink: '' },
      { id: 13, name: 'Brian', todos: [], note: 'Starting next week', expanded: false, editing: false, driveLink: '' },
    ],
  };

  // State initialization with localStorage
  const [calendar, setCalendar] = React.useState(() => {
    try {
      const savedCalendar = localStorage.getItem('contentCalendar');
      return savedCalendar ? JSON.parse(savedCalendar) : initialCalendarState;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialCalendarState;
    }
  });
  
  const [newTodos, setNewTodos] = React.useState({});
  const [showNewClientForm, setShowNewClientForm] = React.useState(false);
  const [newClientData, setNewClientData] = React.useState({ name: '', note: '', day: '' });
  const [editingDriveLink, setEditingDriveLink] = React.useState({});

  // Save to localStorage whenever calendar changes
  React.useEffect(() => {
    try {
      localStorage.setItem('contentCalendar', JSON.stringify(calendar));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [calendar]);

  // Toggle folder expand/collapse
  const toggleExpand = (day, clientId) => {
    setCalendar({
      ...calendar,
      [day]: calendar[day].map(client => 
        client.id === clientId ? { ...client, expanded: !client.expanded } : client
      )
    });
  };

  // Handle adding a new todo
  const handleAddTodo = (day, clientId) => {
    if (!newTodos[clientId] || newTodos[clientId].trim() === '') return;
    
    setCalendar({
      ...calendar,
      [day]: calendar[day].map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            todos: [
              ...client.todos,
              { id: Date.now(), text: newTodos[clientId], completed: false }
            ]
          };
        }
        return client;
      })
    });
    
    // Clear the input
    setNewTodos({
      ...newTodos,
      [clientId]: ''
    });
  };

  // Handle editing a client's note
  const toggleEditing = (day, clientId) => {
    setCalendar({
      ...calendar,
      [day]: calendar[day].map(client =>
        client.id === clientId ? { ...client, editing: !client.editing } : client
      )
    });
  };

  // Update a client's note
  const updateNote = (day, clientId, newNote) => {
    setCalendar({
      ...calendar,
      [day]: calendar[day].map(client =>
        client.id === clientId ? { ...client, note: newNote, editing: false } : client
      )
    });
  };

  // Toggle todo completion
  const toggleTodoComplete = (day, clientId, todoId) => {
    setCalendar({
      ...calendar,
      [day]: calendar[day].map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            todos: client.todos.map(todo => 
              todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            )
          };
        }
        return client;
      })
    });
  };

  // Delete a todo
  const deleteTodo = (day, clientId, todoId) => {
    setCalendar({
      ...calendar,
      [day]: calendar[day].map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            todos: client.todos.filter(todo => todo.id !== todoId)
          };
        }
        return client;
      })
    });
  };
  
  // Add a new client
  const addNewClient = () => {
    if (!newClientData.name || !newClientData.day) return;
    
    const newId = Date.now();
    setCalendar({
      ...calendar,
      [newClientData.day]: [
        ...calendar[newClientData.day],
        {
          id: newId,
          name: newClientData.name,
          note: newClientData.note,
          todos: [],
          expanded: false,
          editing: false,
          driveLink: ''
        }
      ]
    });
    
    // Reset form
    setNewClientData({
      name: '',
      note: '',
      day: ''
    });
    setShowNewClientForm(false);
  };
  
  // Update Google Drive link
  const updateDriveLink = (day, clientId, link) => {
    setCalendar({
      ...calendar,
      [day]: calendar[day].map(client =>
        client.id === clientId ? { ...client, driveLink: link } : client
      )
    });
    
    // Reset editing state
    setEditingDriveLink({
      ...editingDriveLink,
      [clientId]: false
    });
  };

  // Export calendar data as JSON
  const exportData = () => {
    const dataStr = JSON.stringify(calendar, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `content-calendar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import calendar data from JSON
  const importData = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      try {
        const content = JSON.parse(e.target.result);
        if (window.confirm('This will override your current data. Continue?')) {
          setCalendar(content);
        }
      } catch (error) {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    };
  };

  // Reset calendar to initial state
  const resetCalendar = () => {
    if (window.confirm('This will reset all your data to the initial state. Are you sure?')) {
      setCalendar(initialCalendarState);
    }
  };

  // Days of the week for iteration
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <LucideCalendar className="mr-2" /> Weekly Content Deliverables
        </h1>
        <div className="flex space-x-2">
          {/* Data management tools */}
          <div className="flex space-x-2 mr-3">
            <button
              onClick={exportData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              title="Export calendar data"
            >
              Export
            </button>
            
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={resetCalendar}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
              title="Reset to initial data"
            >
              Reset
            </button>
          </div>
          
          <button 
            onClick={() => setShowNewClientForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center"
          >
            <LucidePlus size={18} className="mr-1" /> Add Client
          </button>
        </div>
      </div>
      
      {showNewClientForm && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-3">Add New Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                value={newClientData.name}
                onChange={(e) => setNewClientData({...newClientData, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select
                value={newClientData.day}
                onChange={(e) => setNewClientData({...newClientData, day: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select day</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={newClientData.note}
              onChange={(e) => setNewClientData({...newClientData, note: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Add any notes"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowNewClientForm(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={addNewClient}
              className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
            >
              Add Client
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {days.map(day => (
          <div key={day} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white py-2 px-4 font-semibold">
              {day}
            </div>
            <div className="divide-y divide-gray-200">
              {calendar[day].map(client => (
                <div key={client.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <LucideFolder className="text-blue-500" />
                      <h3 className="font-medium">{client.name}</h3>
                      {client.note && !client.editing && (
                        <span className="text-sm text-gray-500 ml-2">({client.note})</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Google Drive Link */}
                      {!editingDriveLink[client.id] ? (
                        <button 
                          onClick={() => setEditingDriveLink({...editingDriveLink, [client.id]: true})}
                          className="text-gray-500 hover:text-blue-500"
                          title="Connect to Google Drive"
                        >
                          <LucideLink size={16} />
                        </button>
                      ) : (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={client.driveLink || ''}
                            onChange={(e) => {
                              const newLink = e.target.value;
                              setCalendar({
                                ...calendar,
                                [day]: calendar[day].map(c =>
                                  c.id === client.id ? { ...c, driveLink: newLink } : c
                                )
                              });
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm mr-2"
                            placeholder="Paste Google Drive link"
                          />
                          <button 
                            onClick={() => updateDriveLink(day, client.id, client.driveLink)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <LucideSave size={16} />
                          </button>
                        </div>
                      )}
                      
                      {/* View Drive Link if exists */}
                      {client.driveLink && !editingDriveLink[client.id] && (
                        <a 
                          href={client.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                          title="Open Google Drive folder"
                        >
                          <LucideExternalLink size={16} />
                        </a>
                      )}
                      
                      {/* Edit Notes */}
                      {!client.editing ? (
                        <button 
                          onClick={() => toggleEditing(day, client.id)}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <LucideEdit size={16} />
                        </button>
                      ) : (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={client.note}
                            onChange={(e) => {
                              const newNote = e.target.value;
                              setCalendar({
                                ...calendar,
                                [day]: calendar[day].map(c =>
                                  c.id === client.id ? { ...c, note: newNote } : c
                                )
                              });
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm mr-2"
                            placeholder="Add note"
                          />
                          <button 
                            onClick={() => updateNote(day, client.id, client.note)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <LucideSave size={16} />
                          </button>
                        </div>
                      )}
                      
                      {/* Expand/Collapse */}
                      <button 
                        onClick={() => toggleExpand(day, client.id)} 
                        className="text-gray-500 hover:text-blue-500"
                      >
                        {client.expanded ? <LucideChevronUp size={20} /> : <LucideChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {client.expanded && (
                    <div className="mt-4 pl-6">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">To-Do Items</span>
                        </div>
                        <ul className="space-y-2">
                          {client.todos.map(todo => (
                            <li key={todo.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <button 
                                  onClick={() => toggleTodoComplete(day, client.id, todo.id)}
                                  className="mr-2 text-gray-500 hover:text-blue-500"
                                >
                                  {todo.completed ? 
                                    <LucideCheckSquare className="text-green-500" size={18} /> : 
                                    <LucideSquare size={18} />
                                  }
                                </button>
                                <span className={todo.completed ? "line-through text-gray-500" : ""}>
                                  {todo.text}
                                </span>
                              </div>
                              <button 
                                onClick={() => deleteTodo(day, client.id, todo.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <LucideX size={16} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={newTodos[client.id] || ''}
                          onChange={(e) => setNewTodos({...newTodos, [client.id]: e.target.value})}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo(day, client.id)}
                          placeholder="Add a to-do item"
                          className="flex-1 border border-gray-300 rounded-l px-3 py-1 text-sm"
                        />
                        <button
                          onClick={() => handleAddTodo(day, client.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600 flex items-center"
                        >
                          <LucidePlus size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<ContentCalendar />, document.getElementById('root'));