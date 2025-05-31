import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [error, setError] = useState(""); // helper text when length ≤ 3

  // Load from localStorage on mount
  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      const stored = JSON.parse(todoString);
      setTodos(stored);
    }
  }, []);

  // Always save the latest todos array
  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleAdd = () => {
    // If user somehow bypasses disabled state, just guard again:
    if (todo.trim().length < 4) {
      setError("Task must be at least 4 characters.");
      return;
    }

    const newTodoObj = {
      id: uuidv4(),
      todo: todo.trim(),
      isCompleted: false,
    };

    const updated = [...todos, newTodoObj];
    setTodos(updated);
    setTodo("");
    setError("");
    saveToLS();
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    const found = todos.find((i) => i.id === id);
    if (!found) return;

    setTodo(found.todo);
    // Remove that item from the list so, when user clicks “Add,” it replaces it
    const filtered = todos.filter((item) => item.id !== id);
    setTodos(filtered);
    setError("");
    saveToLS();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const filtered = todos.filter((item) => item.id !== id);
    setTodos(filtered);
    saveToLS();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
    if (e.target.value.trim().length >= 4) {
      setError("");
    }
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    if (index === -1) return;

    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (todo.trim().length < 4) {
        setError("Task must be at least 4 characters.");
        return;
      }
      handleAdd();
    }
  };

  return (
    <>
      <Navbar />

      <div className="md:container mx-auto my-16 max-w-md rounded-xl shadow-xl overflow-hidden bg-[#faf5ee]">
        <div className="h-4 w-full bg-gray-500"></div>

        <div className="p-6">
          <h1 className="font-semibold text-center text-2xl text-gray-800 pb-2">
            iTask – Manage your daily tasks at one place
          </h1>
          <div className="border-t border-gray-200 mb-4"></div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Add a Todo
            </h2>
            <input
              type="text"
              value={todo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type at least 4 characters..."
              className="
                w-full
                bg-white
                border border-gray-300
                rounded-lg
                px-4 py-2
                text-gray-800
                focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200
                transition
              "
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            <button
              onClick={handleAdd}
              disabled={todo.trim().length < 4}
              className={`
                mt-4
                w-full
                text-white
                text-sm font-semibold
                py-2 rounded-lg
                transition
                ${
                  todo.trim().length >= 4
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              Add
            </button>
          </div>

          <div className="flex items-center mb-2">
            <input
              id="showFinished"
              type="checkbox"
              checked={showFinished}
              onChange={toggleFinished}
              className="
                h-5 w-5
                text-purple-600
                border-gray-300 rounded
                focus:ring-purple-500
                transition
              "
            />
            <label
              htmlFor="showFinished"
              className="ml-2 text-gray-800 text-sm font-medium"
            >
              Show Finished
            </label>
          </div>
          <div className="border-t border-gray-200 mb-4"></div>

          <h2 className="text-lg font-medium text-gray-700 mb-2">Your Todos</h2>
          <div className="bg-[#f8f5f2] border border-gray-200 rounded-lg p-4">
            {todos.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No Todos to display
              </div>
            )}

            {todos.map((item) => {
              // Only render if showFinished is true OR item.isCompleted is false
              if (!showFinished && item.isCompleted) return null;

              return (
                <div
                  key={item.id}
                  className="
                    flex items-center justify-between
                    py-3 px-4
                    hover:bg-gray-100
                    rounded-md
                    transition
                  "
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={item.id}
                      checked={item.isCompleted}
                      onChange={handleCheckbox}
                      className="
                        h-5 w-5
                        text-purple-600
                        border-gray-300 rounded
                        focus:ring-purple-500
                        transition
                      "
                    />
                    <span
                      className={`
                        ml-3
                        text-sm
                        ${
                          item.isCompleted
                            ? "text-gray-400 line-through"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {item.todo}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!item.isCompleted && (
                      <button
                        onClick={(e) => handleEdit(e, item.id)}
                        className="
                          p-1
                          text-gray-600 hover:text-gray-800
                          transition
                          focus:outline-none
                        "
                      >
                        <CiEdit size={22} />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="
                        p-1
                        text-red-600 hover:text-red-800
                        transition
                        focus:outline-none
                      "
                    >
                      <MdDelete size={22} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
